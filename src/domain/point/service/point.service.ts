import { Inject, Injectable } from '@nestjs/common';
import { PointRepository, PointRepositorySymbol } from '../interface/repository/point.repository';
import { PointHistoryRepository, PointHistoryRepositorySymbol } from '../interface/repository/point-history.repository';
import { EntityManager } from 'typeorm';
import { Point } from '../model/point.domain';
import { ChargePointDTO, PayPointDTO } from '../dto/charge-point.dto';
import { CreatePointHistoryDTO } from '../dto/create-point-history.dto';
import { PointHistory } from '../model/point-history.domain';
import { CustomLock } from 'src/common/interface/database.interface';
import { PointTransactionType } from '../enum/point.enum';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

@Injectable()
export class PointService {
  constructor(
    @Inject(PointRepositorySymbol) private readonly pointRepository: PointRepository,
    @Inject(PointHistoryRepositorySymbol) private readonly pointHistoryRepository: PointHistoryRepository,
  ) {}

  async read(userId: number): Promise<Point> {
    return await this.findOneByUserIdOrThrow(userId);
  }

  async charge(dto: ChargePointDTO, entityManager: EntityManager, lock: CustomLock): Promise<Point> {
    const point = await this.findOneByUserIdOrThrow(dto.userId, entityManager, lock);

    point.charge(dto.amount);

    const savedPoint = await this.pointRepository.save(point, entityManager);

    await this.createHistory(
      {
        userId: dto.userId,
        pointId: savedPoint.id,
        amount: dto.amount,
        transactionType: PointTransactionType.CHARGE,
      },
      entityManager,
    );

    return savedPoint;
  }

  async use(dto: PayPointDTO, entityManager: EntityManager, lock: CustomLock): Promise<Point> {
    const point = await this.findOneByUserIdOrThrow(dto.userId, entityManager, lock);

    point.use(dto.amount);

    const savedPoint = await this.pointRepository.save(point, entityManager);

    await this.createHistory(
      {
        userId: dto.userId,
        pointId: savedPoint.id,
        amount: dto.amount,
        transactionType: PointTransactionType.USE,
      },
      entityManager,
    );

    return savedPoint;
  }

  private async createHistory(dto: CreatePointHistoryDTO, entityManager: EntityManager): Promise<PointHistory> {
    const pointHistory = PointHistory.create(dto);

    return await this.pointHistoryRepository.save(pointHistory, entityManager);
  }

  private async findOneByUserIdOrThrow(userId: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Point> {
    const point = await this.pointRepository.findOneByUserId(userId, entityManager, lock);

    if (!point) {
      throw new CustomException(ErrorCode.POINT_NOT_FOUND);
    }

    return point;
  }
}
