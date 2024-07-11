import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PointRepository, PointRepositorySymbol } from '../interface/repository/point.repository';
import { PointHistoryRepository, PointHistoryRepositorySymbol } from '../interface/repository/point-history.repository';
import { EntityManager } from 'typeorm';
import { Point } from '../model/point.domain';
import { ChargePointDTO, PayPointDTO } from '../dto/charge-point.dto';
import { CreatePointHistoryDTO } from '../dto/create-point-history.dto';
import { PointHistory } from '../model/point-history.domain';
import { CustomLock } from 'src/domain/database/interface/lock.interface';
import { PointTransactionType } from '../enum/point.enum';

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

  async pay(dto: PayPointDTO, entityManager: EntityManager, lock: CustomLock): Promise<Point> {
    const point = await this.findOneByUserIdOrThrow(dto.userId, entityManager, lock);

    point.pay(dto.amount);

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
      throw new NotFoundException('유저의 포인트가 존재하지 않습니다.');
    }

    return point;
  }
}
