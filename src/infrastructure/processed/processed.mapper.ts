import { Processed } from 'src/domain/processed/model/processed.domain';
import { ProcessedEntity } from './processed.entity';

export class ProcessedMapper {
  static toDomain(entity: ProcessedEntity): Processed {
    return new Processed(entity.id, entity.outboxId, entity.status);
  }

  static toEntity(domain: Processed): ProcessedEntity {
    const entity = new ProcessedEntity();

    entity.id = domain.id;
    entity.outboxId = domain.outboxId;
    entity.status = domain.status;

    return entity;
  }
}
