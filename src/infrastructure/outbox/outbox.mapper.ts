import { Outbox } from 'src/domain/outbox/model/outbox.domain';
import { OutboxEntity } from './outbox.entity';

export class OutboxMapper {
  static toDomain(entity: OutboxEntity): Outbox {
    return new Outbox(entity.id, entity.topic, entity.message, entity.status);
  }

  static toEntity(domain: Outbox): OutboxEntity {
    const entity = new OutboxEntity();

    entity.id = domain.id;
    entity.topic = domain.topic;
    entity.message = domain.message;
    entity.status = domain.status;

    return entity;
  }
}
