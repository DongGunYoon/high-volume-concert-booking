import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PayConcertBookingUseCaseDTO } from 'src/application/concert/dto/pay-concert-booking.use-case.dto';
import { PayConcertBookingUseCase, PayConcertBookingUseCaseSymbol } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { Point } from 'src/domain/point/model/point.domain';
import { User } from 'src/domain/user/model/user.domain';
import { ConcertBookingEntity } from 'src/infrastructure/concert/entity/concert-booking.entity';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertBookingMapper } from 'src/infrastructure/concert/mapper/concert-booking.mapper';
import { ConcertScheduleMapper } from 'src/infrastructure/concert/mapper/concert-schedule.mapper';
import { ConcertSeatMapper } from 'src/infrastructure/concert/mapper/concert-seat.mapper';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { PointModule } from 'src/module/point.module';
import { UserModule } from 'src/module/user.module';
import { Repository } from 'typeorm';
import { ERROR_DETAILS } from 'src/common/constant/error-details';
import { CacheModule } from '@nestjs/cache-manager';
import { TestCacheConfig } from 'test/common/test-cache.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TestRedisConfig } from 'test/common/test-redis.config';

describe('PayConcertBookingUseCase', () => {
  let module: TestingModule;
  let payConcertBookingUseCase: PayConcertBookingUseCase;
  let userRepository: Repository<UserEntity>;
  let pointRepository: Repository<Point>;
  let concertRepository: Repository<ConcertEntity>;
  let concertScheduleRepository: Repository<ConcertScheduleEntity>;
  let concertSeatRepository: Repository<ConcertSeatEntity>;
  let concertBookingRepository: Repository<ConcertBookingEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TestTypeORMConfig),
        CacheModule.registerAsync(TestCacheConfig),
        RedisModule.forRootAsync(TestRedisConfig),
        ConcertModule,
        AuthModule,
        PointModule,
        UserModule,
      ],
    }).compile();

    payConcertBookingUseCase = module.get<PayConcertBookingUseCase>(PayConcertBookingUseCaseSymbol);
    userRepository = module.get(getRepositoryToken(UserEntity));
    pointRepository = module.get(getRepositoryToken(PointEntity));
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
    concertScheduleRepository = module.get(getRepositoryToken(ConcertScheduleEntity));
    concertSeatRepository = module.get(getRepositoryToken(ConcertSeatEntity));
    concertBookingRepository = module.get(getRepositoryToken(ConcertBookingEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('콘서트 예약 결제 성공', () => {
    it('콘서트 예약 결제가 성공하면, 결제 정보가 반환됩니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const booking = await createBookableBooking(user.id);
      await setPoint(user.id, 100000);

      // When
      const concertPayment = await payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(user.id, booking.id));

      // Then
      expect(concertPayment).toBeInstanceOf(ConcertPayment);
    });
  });

  describe('콘서트 예약 결제 실패', () => {
    it('존재하지 않는 예약으로 결제 요청 시, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');

      // When
      const exectue = async () => await payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(user.id, -1));

      // Then
      await expect(exectue).rejects.toThrow('콘서트 예약이 존재하지 않습니다.');
    });

    it('결제 금액이 모자르면, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const booking = await createBookableBooking(user.id);
      await setPoint(user.id, 0);

      // When
      const exectue = async () => await payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(user.id, booking.id));

      // Then
      await expect(exectue).rejects.toThrow('결제에 필요한 금액이 모자릅니다.');
    });

    it('다름 사람의 예약을 결제 요청 시, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const booking = await createBookableBooking(user.id);
      await setPoint(user.id, 100000);

      // When
      const exectue = async () => await payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(-1, booking.id));

      // Then
      await expect(exectue).rejects.toThrow('내가 예약한 콘서트만 결제 가능합니다.');
    });
  });

  describe('콘서트 예약 결제 동시성 테스트', () => {
    it(`2건의 결제가 동시에 발생했다면, 한 요청에 대해서 낙관적 에러가 발생합니다.`, async () => {
      // Given
      const user = await createUser('예약자');
      const booking = await createBookableBooking(user.id);
      const payBooking = () => payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(user.id, booking.id));
      await setPoint(user.id, 100000);

      // When
      const results = await Promise.allSettled(Array.from({ length: 2 }, () => payBooking()));

      // Then
      const failedResult = results.find(result => result.status === 'rejected') as PromiseRejectedResult;
      expect(failedResult).toBeDefined();
      expect(failedResult.reason).toMatchObject({
        status: ERROR_DETAILS.OPTIMISTIC_LOCK_CONFLICT.statusCode,
        response: ERROR_DETAILS.OPTIMISTIC_LOCK_CONFLICT.message,
      });
    });

    it(`100개의 동시 결제 요청이 들어와도, 하나의 요청만 성공해야 합니다.`, async () => {
      // Given
      const user = await createUser('예약자');
      const booking = await createBookableBooking(user.id);
      const payBooking = () => payConcertBookingUseCase.execute(new PayConcertBookingUseCaseDTO(user.id, booking.id));
      await setPoint(user.id, 100000);

      // When
      const results = await Promise.allSettled(Array.from({ length: 100 }, () => payBooking()));

      // Then
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const failedCount = results.filter(result => result.status === 'rejected').length;
      expect(successCount).toBe(1);
      expect(failedCount).toBe(99);
    });
  });

  const createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await userRepository.save(user));
  };

  const setPoint = async (userId: number, amount: number): Promise<void> => {
    await pointRepository.update({ userId }, { amount });
  };

  const createBookableBooking = async (userId: number): Promise<ConcertBooking> => {
    const concert = await concertRepository.save(ConcertMapper.toEntity(new Concert(0, '콘서트', null)));
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = await concertScheduleRepository.save(
      ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concert.id, pastDate, futureDate, futureDate, futureDate)),
    );
    const concertSeat = await concertSeatRepository.save(
      ConcertSeatMapper.toEntity(new ConcertSeat(0, concert.id, concertSchedule.id, 10000, 1, false, futureDate)),
    );
    const concertBooking = ConcertBookingMapper.toEntity(
      new ConcertBooking(0, userId, concert.id, concertSchedule.id, concertSeat.id, concertSeat.price, false, futureDate),
    );

    return ConcertBookingMapper.toDomain(await concertBookingRepository.save(concertBooking));
  };
});
