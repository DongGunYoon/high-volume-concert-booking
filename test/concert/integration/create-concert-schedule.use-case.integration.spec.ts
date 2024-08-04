import { RedisModule } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CreateConcertScheduleUseCaseDTO } from 'src/application/concert/dto/create-concert-schedule.use-case.dto';
import { CreateConcertScheduleUseCase } from 'src/application/concert/use-case/create-concert-schedule.use-case.impl';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { TestCacheConfig } from 'test/common/test-cache.config';
import { TestRedisConfig } from 'test/common/test-redis.config';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { Repository } from 'typeorm';

describe('CreateConcertScheduleUseCase', () => {
  let module: TestingModule;
  let cacheManager: Cache;
  let createConcertScheduleUseCase: CreateConcertScheduleUseCase;
  let concertRepository: Repository<ConcertEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TestTypeORMConfig),
        CacheModule.registerAsync(TestCacheConfig),
        RedisModule.forRootAsync(TestRedisConfig),
        ConcertModule,
        AuthModule,
      ],
    }).compile();

    cacheManager = module.get(CACHE_MANAGER);
    createConcertScheduleUseCase = module.get(CreateConcertScheduleUseCase);
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('콘서트 스케쥴 생성 성공', () => {
    it('입력한 정보와 동일한 콘서트 스케쥴이 생성됩니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');
      const dto = new CreateConcertScheduleUseCaseDTO(concert.id, new Date(), new Date(), new Date(), new Date());

      // When
      const schedule = await createConcertScheduleUseCase.execute(dto);

      // Then
      expect(schedule.concertId).toBe(dto.concertId);
      expect(schedule.bookingStartAt).toBe(dto.bookingStartAt);
      expect(schedule.bookingEndAt).toBe(dto.bookingEndAt);
      expect(schedule.startAt).toBe(dto.startAt);
      expect(schedule.endAt).toBe(dto.endAt);
    });
  });

  describe('콘서트 스케쥴 생성 캐시 테스트', () => {
    it('콘서트 스케쥴이 생성되면 해당 콘서트의 예약 가능한 스케쥴 목록 조회 캐시가 비어있어야 합니다.', async () => {
      // Given
      const concert = await createConcert('콘서트');
      const dto = new CreateConcertScheduleUseCaseDTO(concert.id, new Date(), new Date(), new Date(), new Date());

      // When
      await createConcertScheduleUseCase.execute(dto);

      // Then
      expect(await cacheManager.get(`concerts:${concert.id}:bookable_schedules`)).toBe(undefined);
    });

    it('이미 예약 가능한 스케쥴 목록 조회 캐시가 있었더라도 삭제되어야 합니다.', async () => {
      const concert = await createConcert('콘서트');
      await cacheManager.set(`concerts:${concert.id}:bookable_schedules`, '[]');
      const dto = new CreateConcertScheduleUseCaseDTO(concert.id, new Date(), new Date(), new Date(), new Date());

      // When
      await createConcertScheduleUseCase.execute(dto);

      // Then
      expect(await cacheManager.get(`concerts:${concert.id}:bookable_schedules`)).toBe(undefined);
    });

    it('다른 콘서트의 스케쥴 목록 조회 캐시가 있다면, 변경되지 않아야 합니다.', async () => {
      const concert = await createConcert('콘서트');
      await cacheManager.set(`concerts:${concert.id + 1}:bookable_schedules`, '[]');
      const dto = new CreateConcertScheduleUseCaseDTO(concert.id, new Date(), new Date(), new Date(), new Date());

      // When
      await createConcertScheduleUseCase.execute(dto);

      // Then
      expect(await cacheManager.get(`concerts:${concert.id + 1}:bookable_schedules`)).toBe('[]');
    });
  });

  const createConcert = async (title: string): Promise<Concert> => {
    const concert = ConcertMapper.toEntity(new Concert(0, title, null));

    return ConcertMapper.toDomain(await concertRepository.save(concert));
  };
});
