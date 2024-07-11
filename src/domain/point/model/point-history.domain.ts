import { BadRequestException } from '@nestjs/common';
import { CreatePointHistoryDTO } from '../dto/create-point-history.dto';
import { PointTransactionType } from '../enum/point.enum';

export class PointHistory {
  constructor(
    public id: number,
    public userId: number,
    public pointId: number,
    public amount: number,
    public transactionType: PointTransactionType,
    public createdAt: Date,
  ) {}

  static create(dto: CreatePointHistoryDTO): PointHistory {
    if (dto.amount <= 0) {
      throw new BadRequestException('충전 금액은 최소 0원 이상이어야 합니다.');
    }

    return new PointHistory(0, dto.userId, dto.pointId, dto.amount, dto.transactionType, new Date());
  }
}
