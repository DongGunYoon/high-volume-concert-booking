import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { ConcertSeatEntity } from '../entity/concert-seat.entity';
import { ConcertScheduleMapper } from './concert-schedule.mapper';

export class ConcertSeatMapper {
  static toDomain(entity: ConcertSeatEntity): ConcertSeat {
    return new ConcertSeat(
      entity.id,
      entity.concertId,
      entity.concertScheduleId,
      entity.price,
      entity.number,
      entity.isPaid,
      entity.reservedUntil,
      entity.concertSchedule && ConcertScheduleMapper.toDomain(entity.concertSchedule),
    );
  }

  static toEntity(domain: ConcertSeat): ConcertSeatEntity {
    const entity = new ConcertSeatEntity();

    entity.id = domain.id;
    entity.concertId = domain.concertId;
    entity.concertScheduleId = domain.concertScheduleId;
    entity.price = domain.price;
    entity.number = domain.number;
    entity.isPaid = domain.isPaid;
    entity.reservedUntil = domain.reservedUntil;
    entity.concertSchedule = domain.concertSchedule && ConcertScheduleMapper.toEntity(domain.concertSchedule);

    return entity;
  }
}
