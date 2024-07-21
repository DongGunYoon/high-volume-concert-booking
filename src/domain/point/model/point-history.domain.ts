import { CreatePointHistoryDTO } from '../dto/create-point-history.dto';
import { PointTransactionType } from '../enum/point.enum';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

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
      throw new CustomException(ErrorCode.MINIMUM_CHARGE_AMOUNT);
    }

    return new PointHistory(0, dto.userId, dto.pointId, dto.amount, dto.transactionType, new Date());
  }
}
