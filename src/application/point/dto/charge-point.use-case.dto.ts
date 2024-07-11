import { ChargePointDTO } from 'src/domain/point/dto/charge-point.dto';
import { CreatePointHistoryDTO } from 'src/domain/point/dto/create-point-history.dto';
import { PointTransactionType } from 'src/domain/point/enum/point.enum';

export class ChargePointUseCaseDTO {
  userId: number;
  amount: number;

  constructor(userId: number, amount: number) {
    this.userId = userId;
    this.amount = amount;
  }

  toChargePointDTO(): ChargePointDTO {
    return {
      userId: this.userId,
      amount: this.amount,
    };
  }

  toCreateHistoryDTO(pointId: number, transactionType: PointTransactionType): CreatePointHistoryDTO {
    return {
      userId: this.userId,
      pointId: pointId,
      amount: this.amount,
      transactionType: transactionType,
    };
  }
}
