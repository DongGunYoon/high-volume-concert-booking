import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertBookingEntity } from '../entity/concert-booking.entity';

export class ConcertBookingMapper {
  static toDomain(entity: ConcertBookingEntity): ConcertBooking {
    return new ConcertBooking(
      entity.id,
      entity.userId,
      entity.concertId,
      entity.concertScheduleId,
      entity.concertSeatId,
      entity.price,
      entity.isPaid,
      entity.expiresAt,
    );
  }

  static toEntity(domain: ConcertBooking): ConcertBookingEntity {
    const entity = new ConcertBookingEntity();

    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.concertId = domain.concertId;
    entity.concertScheduleId = domain.concertScheduleId;
    entity.concertSeatId = domain.concertSeatId;
    entity.price = domain.price;
    entity.isPaid = domain.isPaid;
    entity.expiresAt = domain.expiresAt;

    return entity;
  }
}
