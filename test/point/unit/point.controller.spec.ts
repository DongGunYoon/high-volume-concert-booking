import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserAuthGuard } from 'src/domain/auth/guard/auth.guard';
import { ChargePointUseCase, ChargePointUseCaseSymbol } from 'src/domain/point/interface/use-case/charge-point.use-case';
import { ReadPointUseCase, ReadPointUseCaseSymbol } from 'src/domain/point/interface/use-case/read-point.use-case';
import { Point } from 'src/domain/point/model/point.domain';
import { PointController } from 'src/presentation/point/controller/point.controller';
import { ChargePointRequest } from 'src/presentation/point/dto/request/charge-point.request';
import { PointResponse } from 'src/presentation/point/dto/response/point.response';

describe('PointController', () => {
  let pointController: PointController;
  let chargePointUseCase: ChargePointUseCase;
  let readPointUseCase: ReadPointUseCase;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [PointController],
      providers: [
        { provide: ChargePointUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: ReadPointUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        {
          provide: UserAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    pointController = module.get<PointController>(PointController);
    chargePointUseCase = module.get<ChargePointUseCase>(ChargePointUseCaseSymbol);
    readPointUseCase = module.get<ReadPointUseCase>(ReadPointUseCaseSymbol);
  });

  describe('포인트 조회', () => {
    it('유저가 자신의 포인트를 조회합니다.', async () => {
      // Given
      const point = new Point(1, 1, 1000);
      jest.spyOn(readPointUseCase, 'execute').mockResolvedValue(point);

      // When
      const response = await pointController.readPoint({ userId: 1 });

      // Then
      expect(response).toBeInstanceOf(PointResponse);
      expect(response.id).toBe(point.id);
      expect(response.userId).toBe(point.userId);
      expect(response.amount).toBe(point.amount);
    });
  });

  describe('포인트 충전', () => {
    it('유저가 자신의 포인트를 충전합니다.', async () => {
      // Given
      const point = new Point(1, 1, 1000);
      jest.spyOn(chargePointUseCase, 'execute').mockResolvedValue(point);

      // When
      const response = await pointController.chargePoint(new ChargePointRequest(1000), { userId: 1 });

      // Then
      expect(response).toBeInstanceOf(PointResponse);
      expect(response.userId).toBe(point.userId);
      expect(response.amount).toBe(point.amount);
    });
  });
});
