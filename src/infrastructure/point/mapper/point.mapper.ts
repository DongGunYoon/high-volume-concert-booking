import { Point } from 'src/domain/point/model/point.domain';
import { PointEntity } from '../entity/point.entity';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    return new Point(entity.id, entity.userId, entity.amount);
  }

  static toEntity(domain: Point): PointEntity {
    const entity = new PointEntity();

    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.amount = domain.amount;
    entity.user = domain.user && UserMapper.toEntity(domain.user);

    return entity;
  }
}
