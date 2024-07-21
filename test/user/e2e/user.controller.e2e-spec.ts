import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import * as request from 'supertest';
import { UserQueueResponse } from 'src/interface/presentation/user/dto/response/user-queue.response';
import { TestDataService } from 'test/common/test-data.service';
import { TestAppModule } from 'test/common/test-app.module';
import { ApiResponse } from 'src/common/dto/api.response';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    testDataService = module.get<TestDataService>(TestDataService);
  });

  afterEach(async () => {
    await testDataService.cleanUpTestData();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('유저 대기열 입장 - POST /users/queue', () => {
    it('아무도 없는 대기열에 입장하면 대기번호 1이 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .post(`/users/queue`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(UserQueueResponse, result.data);

      expect(response.userId).toBe(user.id);
      expect(response.currentOrder).toBe(1);
    });

    it('유저가 생성한 만료되지 않은 대기열이 있다면 해당 대기열이 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const existedUserQueue = await testDataService.createPendingUserQueue(user.id);

      // When
      const result = await request(app.getHttpServer())
        .post(`/users/queue`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(UserQueueResponse, result.data);

      expect(response.id).toBe(existedUserQueue.id);
    });

    it('대기열에 이미 진입한 유저가 존재한다면, 해당 사용자들 이후의 번호가 반환됩니다.', async () => {
      // Given
      const users = await Promise.all(Array.from({ length: 10 }, () => testDataService.createUser('유저')));
      await Promise.all(Array.from({ length: 10 }, (_, i) => testDataService.createPendingUserQueue(users[i].id)));
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .post(`/users/queue`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(UserQueueResponse, result.data);

      expect(response.userId).toBe(user.id);
      expect(response.currentOrder).toBe(11);
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // When
      const result = await request(app.getHttpServer())
        .post(`/users/queue`)
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });
});
