import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';

export class ConcertSeatResponse {
  constructor(
    public id: number,
    public concertScheduleId: number,
    public price: number,
    public number: number,
    public isAvailable: boolean,
  ) {}

  static from(concertSeat: ConcertSeat): ConcertSeatResponse {
    return new ConcertSeatResponse(concertSeat.id, concertSeat.concertScheduleId, concertSeat.price, concertSeat.number, concertSeat.isAvailable());
  }
}
