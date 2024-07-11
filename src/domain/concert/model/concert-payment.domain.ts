import { CreatePaymentDTO } from '../dto/create-payment.dto';
import { ConcertPaymentType } from '../enum/concert.enum';

export class ConcertPayment {
  constructor(
    public id: number,
    public userId: number,
    public concertId: number,
    public concertScheduleId: number,
    public concertSeatId: number,
    public concertBookingId: number,
    public price: number,
    public type: ConcertPaymentType,
  ) {}

  static create(dto: CreatePaymentDTO): ConcertPayment {
    return new ConcertPayment(0, dto.userId, dto.concertId, dto.concertScheduleId, dto.concertSeatId, dto.concertBookingId, dto.price, dto.type);
  }
}
