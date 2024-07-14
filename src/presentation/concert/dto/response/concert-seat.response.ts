import { ConcertSeatStatus } from 'src/domain/concert/enum/concert.enum';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';

export class ConcertSeatResponse {
  constructor(
    public id: number,
    public concertScheduleId: number,
    public price: number,
    public number: number,
    public status: ConcertSeatStatus,
  ) {}

  static from(concertSeat: ConcertSeat): ConcertSeatResponse {
    return new ConcertSeatResponse(concertSeat.id, concertSeat.concertScheduleId, concertSeat.price, concertSeat.number, concertSeat.status);
  }
}
