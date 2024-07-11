import { ConcertBookingStatus } from 'src/domain/concert/enum/concert.enum';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';

export class ConcertBookingResponse {
  constructor(
    public id: number,
    public concertSeatId: number,
    public price: number,
    public status: ConcertBookingStatus,
    public expiresAt: Date,
  ) {}

  static from(concertBooking: ConcertBooking): ConcertBookingResponse {
    return new ConcertBookingResponse(concertBooking.id, concertBooking.concertSeatId, concertBooking.price, concertBooking.status, concertBooking.expiresAt);
  }
}
