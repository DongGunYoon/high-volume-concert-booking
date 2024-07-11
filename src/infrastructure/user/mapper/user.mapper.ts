import { User } from 'src/domain/user/model/user.domain';
import { UserEntity } from '../entity/user.entity';
import { PointMapper } from 'src/infrastructure/point/mapper/point.mapper';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(entity.id, entity.name, entity.point && PointMapper.toDomain(entity.point));
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();

    entity.id = domain.id;
    entity.name = domain.name;

    if (domain.point) {
      entity.point = PointMapper.toEntity(domain.point);
    }

    return entity;
  }
}
