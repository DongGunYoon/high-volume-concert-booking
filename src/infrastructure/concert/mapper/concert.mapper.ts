import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertEntity } from '../entity/concert.entity';

export class ConcertMapper {
  static toDomain(entity: ConcertEntity): Concert {
    return new Concert(entity.id, entity.title, entity.description);
  }

  static toEntity(domain: Concert): ConcertEntity {
    const entity = new ConcertEntity();

    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;

    return entity;
  }
}
