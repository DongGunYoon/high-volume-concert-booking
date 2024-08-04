import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ScanBookableSchedulesUseCase, ScanBookableSchedulesUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertScheduleMapper } from 'src/infrastructure/concert/mapper/concert-schedule.mapper';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { Repository } from 'typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { TestCacheConfig } from 'test/common/test-cache.config';

describe('ScanBookableSchedulesUseCase', () => {
  let module: TestingModule;
  let scanBookableSchedulesUseCase: ScanBookableSchedulesUseCase;
  let concertRepository: Repository<ConcertEntity>;
  let concertScheduleRepository: Repository<ConcertScheduleEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), CacheModule.registerAsync(TestCacheConfig), ConcertModule, AuthModule],
    }).compile();

    scanBookableSchedulesUseCase = module.get<ScanBookableSchedulesUseCase>(ScanBookableSchedulesUseCaseSymbol);
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
    concertScheduleRepository = module.get(getRepositoryToken(ConcertScheduleEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('예약 가능한 스케쥴 목록 조회 성공', () => {
    it('생성된 스케쥴 목록이 없다면 빈 배열이 조회됩니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');

      // When
      const bookableSchedules = await scanBookableSchedulesUseCase.execute(concert.id);

      // Then
      expect(bookableSchedules).toHaveLength(0);
    });

    it('생성된 예약 가능 스케쥴이 없다면 빈 배열이 조회됩니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');
      await createNonBookableSchedule(concert.id);

      // When
      const bookableSchedules = await scanBookableSchedulesUseCase.execute(concert.id);

      // Then
      expect(bookableSchedules).toHaveLength(0);
    });

    it('생성된 예약 가능 스케쥴이 많다면 예약 가능한 스케쥴들이 조회됩니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');
      await createBookableSchedule(concert.id);
      await createBookableSchedule(concert.id);
      await createNonBookableSchedule(concert.id);

      // When
      const bookableSchedules = await scanBookableSchedulesUseCase.execute(concert.id);

      // Then
      expect(bookableSchedules).toHaveLength(2);
      expect(bookableSchedules[0].concertId).toBe(concert.id);
      expect(bookableSchedules[0].concert).toBeInstanceOf(Concert);
      expect(bookableSchedules[0].concert!.title).toBe('콘서트');
    });
  });

  describe('예약 가능한 스케쥴 목록 조회 실패', () => {
    it('입력된 콘서트가 존재하지 않으면, 에러가 발생합니다.', async () => {
      // Given
      const concertId = -1;

      // When
      const execute = async () => await scanBookableSchedulesUseCase.execute(concertId);

      // Then
      await expect(execute).rejects.toThrow(`콘서트가 존재하지 않습니다.`);
    });
  });

  describe('예약 가능한 스케쥴 목록 캐시 테스트', () => {
    it('100번의 조회 요청이 들어와도, 한번의 DB 요청만 진행되어야 합니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');
      const spy = jest.spyOn(concertScheduleRepository, 'find');
      const scanBookableSchedules = () => scanBookableSchedulesUseCase.execute(concert.id);
      await scanBookableSchedules();

      // When
      await Promise.all(Array.from({ length: 100 }, () => scanBookableSchedules()));

      // Then
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  const createConcert = async (title: string): Promise<Concert> => {
    const concert = ConcertMapper.toEntity(new Concert(0, title, null));

    return ConcertMapper.toDomain(await concertRepository.save(concert));
  };

  const createBookableSchedule = async (concertId: number): Promise<ConcertSchedule> => {
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concertId, pastDate, futureDate, futureDate, futureDate));

    return ConcertScheduleMapper.toDomain(await concertScheduleRepository.save(concertSchedule));
  };

  const createNonBookableSchedule = async (concertId: number): Promise<ConcertSchedule> => {
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concertId, futureDate, futureDate, futureDate, futureDate));

    return ConcertScheduleMapper.toDomain(await concertScheduleRepository.save(concertSchedule));
  };
});
