import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CreateConcertUseCaseDTO } from 'src/application/concert/dto/create-concert-use-case.dto';
import { CreateConcertUseCase } from 'src/application/concert/use-case/create-concert.use-case.impl';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { TestCacheConfig } from 'test/common/test-cache.config';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';

describe('CreateConcertUseCase', () => {
  let module: TestingModule;
  let cacheManager: Cache;
  let createConcertUseCase: CreateConcertUseCase;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), CacheModule.registerAsync(TestCacheConfig), ConcertModule, AuthModule],
    }).compile();

    cacheManager = module.get(CACHE_MANAGER);
    createConcertUseCase = module.get(CreateConcertUseCase);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('콘서트 생성 성공', () => {
    it('입력한 정보와 동일한 콘서트가 생성됩니다.', async () => {
      // Given
      const dto = new CreateConcertUseCaseDTO('콘서트', '멋진 콘서트');

      // When
      const concert = await createConcertUseCase.execute(dto);

      // Then
      expect(concert.title).toBe(dto.title);
      expect(concert.description).toBe(dto.description);
    });

    it('콘서트 설명이 없으면 null값의 설명을 가진 콘서트가 생성됩니다.', async () => {
      // Given
      const dto = new CreateConcertUseCaseDTO('콘서트', null);

      // When
      const concert = await createConcertUseCase.execute(dto);

      // Then
      expect(concert.description).toBeNull();
    });
  });

  describe('콘서트 생성 캐시 테스트', () => {
    it('콘서트가 생성되면 콘서트 목록 조회 캐시가 비어있어야 합니다.', async () => {
      // Given
      const dto = new CreateConcertUseCaseDTO('콘서트', '멋진 콘서트');

      // When
      await createConcertUseCase.execute(dto);

      // Then
      expect(await cacheManager.get('concerts')).toBe(undefined);
    });

    it('이미 콘서트 목록 조회 캐시가 있었더라도, 콘서트가 생성되면 삭제되어야 합니다.', async () => {
      // Given
      await cacheManager.set('concerts', '[]');
      const dto = new CreateConcertUseCaseDTO('콘서트', '멋진 콘서트');

      // When
      await createConcertUseCase.execute(dto);

      // Then
      expect(await cacheManager.get('concerts')).toBe(undefined);
    });
  });
});
