import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BookConcertSeatUseCaseDTO } from 'src/application/concert/dto/book-concert-seat.use-case.dto';
import { Nullable } from 'src/common/type/native';
import { BookConcertSeatUseCase, BookConcertSeatUseCaseSymbol } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { User } from 'src/domain/user/model/user.domain';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertScheduleMapper } from 'src/infrastructure/concert/mapper/concert-schedule.mapper';
import { ConcertSeatMapper } from 'src/infrastructure/concert/mapper/concert-seat.mapper';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { Repository } from 'typeorm';

describe('BookConcertSeatUseCase', () => {
  let module: TestingModule;
  let bookConcertSeatUseCase: BookConcertSeatUseCase;
  let userRepository: Repository<UserEntity>;
  let concertRepository: Repository<ConcertEntity>;
  let concertScheduleRepository: Repository<ConcertScheduleEntity>;
  let concertSeatRepository: Repository<ConcertSeatEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), ConcertModule, AuthModule],
    }).compile();

    bookConcertSeatUseCase = module.get<BookConcertSeatUseCase>(BookConcertSeatUseCaseSymbol);
    userRepository = module.get(getRepositoryToken(UserEntity));
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
    concertScheduleRepository = module.get(getRepositoryToken(ConcertScheduleEntity));
    concertSeatRepository = module.get(getRepositoryToken(ConcertSeatEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('콘서트 좌석 예약 성공', () => {
    it('콘서트 좌석이 예약을 성공하면, 예약 정보가 반환됩니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const schedule = await createBookableSchedule();
      const seat = await createSeat(schedule.concertId, schedule.id, false, null);

      // When
      const concertBooking = await bookConcertSeatUseCase.execute(new BookConcertSeatUseCaseDTO(user.id, seat.concertScheduleId, seat.id));

      // Then
      expect(concertBooking).toBeInstanceOf(ConcertBooking);
    });
  });

  describe('콘서트 좌석 예약 실패', () => {
    it('예약이 불가능한 시간에 시도하면, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const schedule = await createNonBookableSchedule();
      const seat = await createSeat(schedule.concertId, schedule.id, false, null);

      // When
      const book = async () => await bookConcertSeatUseCase.execute(new BookConcertSeatUseCaseDTO(user.id, seat.concertScheduleId, seat.id));

      // Then
      await expect(book).rejects.toThrow('아직 예약 신청 가능 일자가 아닙니다.');
    });

    it('이미 좌석이 예약되었다면, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const schedule = await createBookableSchedule();
      const seat = await createSeat(schedule.concertId, schedule.id, false, new Date(Date.now() + 10000));

      // When
      const book = async () => await bookConcertSeatUseCase.execute(new BookConcertSeatUseCaseDTO(user.id, seat.concertScheduleId, seat.id));

      // Then
      await expect(book).rejects.toThrow('선택한 콘서트 좌석은 이미 예약되었습니다.');
    });

    it('이미 좌석이 구매되었다면, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('예약자');
      const schedule = await createBookableSchedule();
      const seat = await createSeat(schedule.concertId, schedule.id, true, new Date());

      // When
      const book = async () => await bookConcertSeatUseCase.execute(new BookConcertSeatUseCaseDTO(user.id, seat.concertScheduleId, seat.id));

      // Then
      await expect(book).rejects.toThrow('선택한 콘서트 좌석은 이미 판매되었습니다.');
    });
  });

  const createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await userRepository.save(user));
  };

  const createBookableSchedule = async (): Promise<ConcertSchedule> => {
    const concert = await concertRepository.save(ConcertMapper.toEntity(new Concert(0, '콘서트', null)));
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concert.id, pastDate, futureDate, futureDate, futureDate));

    return ConcertScheduleMapper.toDomain(await concertScheduleRepository.save(concertSchedule));
  };

  const createNonBookableSchedule = async (): Promise<ConcertSchedule> => {
    const concert = await concertRepository.save(ConcertMapper.toEntity(new Concert(0, '콘서트', null)));
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concert.id, futureDate, futureDate, futureDate, futureDate));

    return ConcertScheduleMapper.toDomain(await concertScheduleRepository.save(concertSchedule));
  };

  const createSeat = async (concertId: number, concertScheduleId: number, isPaid: boolean, reservedUntil: Nullable<Date>): Promise<ConcertSeat> => {
    const concertSeat = ConcertSeatMapper.toEntity(new ConcertSeat(0, concertId, concertScheduleId, 10000, 1, isPaid, reservedUntil));

    return ConcertSeatMapper.toDomain(await concertSeatRepository.save(concertSeat));
  };
});
