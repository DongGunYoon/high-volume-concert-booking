import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertPaymentEntity } from '../entity/concert-payment.entity';

export class ConcertPaymentMapper {
  static toDomain(entity: ConcertPaymentEntity): ConcertPayment {
    return new ConcertPayment(
      entity.id,
      entity.userId,
      entity.concertId,
      entity.concertScheduleId,
      entity.concertSeatId,
      entity.concertBookingId,
      entity.price,
      entity.type,
    );
  }

  static toEntity(domain: ConcertPayment): ConcertPaymentEntity {
    const entity = new ConcertPaymentEntity();

    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.concertId = domain.concertId;
    entity.concertScheduleId = domain.concertScheduleId;
    entity.concertSeatId = domain.concertSeatId;
    entity.concertBookingId = domain.concertBookingId;
    entity.price = domain.price;
    entity.type = domain.type;

    return entity;
  }
}
