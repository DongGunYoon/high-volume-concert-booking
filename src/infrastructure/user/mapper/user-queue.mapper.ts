import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { UserQueueEntity } from '../entity/user-queue.entity';

export class UserQueueMapper {
  static toDomain(entity: UserQueueEntity): UserQueue {
    return new UserQueue(entity.id, entity.userId, entity.token, entity.expiresAt);
  }

  static toEntity(domain: UserQueue): UserQueueEntity {
    const entity = new UserQueueEntity();

    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.token = domain.token;
    entity.expiresAt = domain.expiresAt;

    return entity;
  }
}
