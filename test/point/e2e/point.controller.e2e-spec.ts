import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from 'src/common/dto/api.response';
import { PointResponse } from 'src/interface/presentation/point/dto/response/point.response';
import * as request from 'supertest';
import { TestAppModule } from 'test/common/test-app.module';
import { TestDataService } from 'test/common/test-data.service';

describe('PointController (e2e)', () => {
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

  afterAll(async () => {
    await testDataService.cleanUpTestData();
    await app.close();
  });

  describe('유저 포인트 충전 - POST /points/charge', () => {
    it('포인트 충전이 성공한 경우, 충전된 회원의 포인트 정보를 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .post(`/points/charge`)
        .auth(user.issueToken(), { type: 'bearer' })
        .send({ amount: 1000 })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(PointResponse, result.data);

      expect(response.userId).toBe(user.id);
      expect(response.amount).toBe(1000);
    });

    it('포인트 충전이 성공한 경우, 포인트 충전 이력이 생성됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .post(`/points/charge`)
        .auth(user.issueToken(), { type: 'bearer' })
        .send({ amount: 1000 })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(PointResponse, result.data);

      const pointHistory = await testDataService.getPointHistory(user.id);
      expect(pointHistory.userId).toBe(user.id);
      expect(pointHistory.pointId).toBe(response.id);
      expect(pointHistory.amount).toBe(response.amount);
    });

    it('Body에 필요한 데이터를 채우지 않으면, Bad Request Exception이 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .post(`/points/charge`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('Bad Request Exception');
      expect(response.data).toBeNull();
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const amount = 1000;

      // When
      const result = await request(app.getHttpServer())
        .post(`/points/charge`)
        .send({ amount })
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

  describe('유저 포인트 조회 - GET /points', () => {
    it('새로 생성된 유저의 포인트를 조회하면 0원의 amount를 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');

      // When
      const result = await request(app.getHttpServer())
        .get(`/points`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(PointResponse, result.data);

      expect(response.userId).toBe(user.id);
      expect(response.amount).toBe(0);
    });

    it('포인트가 존재하는 유저를 조회하면, 해당하는 포인트 정보를 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      await testDataService.setPoint(user.id, 1004);

      // When
      const result = await request(app.getHttpServer())
        .get(`/points`)
        .auth(user.issueToken(), { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(PointResponse, result.data);

      expect(response.userId).toBe(user.id);
      expect(response.amount).toBe(1004);
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // When
      const result = await request(app.getHttpServer())
        .get(`/points`)
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
