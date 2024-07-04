import { Test } from '@nestjs/testing';
import { PointController } from './point.controller';
import { PointResponse } from '../dto/response/point.response';
import { ChargePointRequest } from '../dto/request/charge-point.request';

describe('PointController', () => {
  let pointController: PointController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PointController],
    }).compile();

    pointController = module.get<PointController>(PointController);
  });

  describe('포인트 조회', () => {
    it('유저가 자신의 포인트를 조회합니다.', async () => {
      // Given
      const userId = 1;

      // When
      const point = await pointController.readPoint();

      // Then
      expect(point).toBeInstanceOf(PointResponse);
      expect(point.userId).toBe(userId);
      expect(point.amount).toBe(1004);
    });
  });

  describe('포인트 충전', () => {
    it('유저가 자신의 포인트를 충전합니다.', async () => {
      // Given
      const userId = 1;
      const amount = 1000;

      // When
      const point = await pointController.chargePoint(new ChargePointRequest(amount));

      // Then
      expect(point).toBeInstanceOf(PointResponse);
      expect(point.userId).toBe(userId);
      expect(point.amount).toBe(amount);
    });
  });
});
