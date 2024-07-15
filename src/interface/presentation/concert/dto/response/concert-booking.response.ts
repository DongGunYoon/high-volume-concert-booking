import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';

export class ConcertBookingResponse {
  constructor(
    public id: number,
    public concertSeatId: number,
    public price: number,
    public isPaid: boolean,
    public expiresAt: Date,
  ) {}

  static from(concertBooking: ConcertBooking): ConcertBookingResponse {
    return new ConcertBookingResponse(concertBooking.id, concertBooking.concertSeatId, concertBooking.price, concertBooking.isPaid, concertBooking.expiresAt);
  }
}
