import { CreateConcertScheduleDTO } from 'src/domain/concert/dto/create-concert-schedule.dto';

export class CreateConcertScheduleUseCaseDTO {
  concertId: number;
  bookingStartAt: Date;
  bookingEndAt: Date;
  startAt: Date;
  endAt: Date;

  constructor(concertId: number, bookingStartAt: Date, bookingEndAt: Date, startAt: Date, endAt: Date) {
    this.concertId = concertId;
    this.bookingStartAt = bookingStartAt;
    this.bookingEndAt = bookingEndAt;
    this.startAt = startAt;
    this.endAt = endAt;
  }

  toCreateConcertScheduleDTO(): CreateConcertScheduleDTO {
    return {
      concertId: this.concertId,
      bookingStartAt: this.bookingStartAt,
      bookingEndAt: this.bookingEndAt,
      startAt: this.startAt,
      endAt: this.endAt,
    };
  }
}
