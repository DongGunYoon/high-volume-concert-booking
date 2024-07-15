import { ConcertPaymentType } from 'src/domain/concert/enum/concert.enum';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';

export class ConcertPaymentResponse {
  constructor(
    public id: number,
    public price: number,
    public type: ConcertPaymentType,
  ) {}

  static from(concertPayment: ConcertPayment): ConcertPaymentResponse {
    return new ConcertPaymentResponse(concertPayment.id, concertPayment.price, concertPayment.type);
  }
}
