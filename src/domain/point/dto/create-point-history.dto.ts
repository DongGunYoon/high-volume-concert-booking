import { PointTransactionType } from '../enum/point.enum';

export type CreatePointHistoryDTO = {
  userId: number;
  pointId: number;
  amount: number;
  transactionType: PointTransactionType;
};
