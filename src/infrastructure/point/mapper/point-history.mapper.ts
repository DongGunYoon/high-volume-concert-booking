import { PointHistory } from 'src/domain/point/model/point-history.domain';
import { PointHistoryEntity } from '../entity/point-history.entity';

export class PointHistoryMapper {
  static toDomain(entity: PointHistoryEntity): PointHistory {
    return new PointHistory(entity.id, entity.userId, entity.pointId, entity.amount, entity.transactionType, entity.createdAt);
  }

  static toEntity(domain: PointHistory): PointHistoryEntity {
    const entity = new PointHistoryEntity();

    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.pointId = domain.pointId;
    entity.amount = domain.amount;
    entity.transactionType = domain.transactionType;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
