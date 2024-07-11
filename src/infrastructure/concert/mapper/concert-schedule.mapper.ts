import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertScheduleEntity } from '../entity/concert-schedule.entity';
import { ConcertMapper } from './concert.mapper';

export class ConcertScheduleMapper {
  static toDomain(entity: ConcertScheduleEntity): ConcertSchedule {
    return new ConcertSchedule(
      entity.id,
      entity.concertId,
      entity.bookingStartAt,
      entity.bookingEndAt,
      entity.startAt,
      entity.endAt,
      entity.concert && ConcertMapper.toDomain(entity.concert),
    );
  }

  static toEntity(domain: ConcertSchedule): ConcertScheduleEntity {
    const entity = new ConcertScheduleEntity();

    entity.id = domain.id;
    entity.concertId = domain.concertId;
    entity.bookingStartAt = domain.bookingStartAt;
    entity.bookingEndAt = domain.bookingEndAt;
    entity.startAt = domain.startAt;
    entity.endAt = domain.endAt;
    entity.concert = domain.concert && ConcertMapper.toEntity(domain.concert);

    return entity;
  }
}
