import { IsDate } from 'class-validator';
import { CreateConcertScheduleUseCaseDTO } from 'src/application/concert/dto/create-concert-schedule.use-case.dto';

export class CreateConcertScheduleRequest {
  constructor(bookingStartAt: Date, bookingEndAt: Date, startAt: Date, endAt: Date) {
    this.bookingStartAt = bookingStartAt;
    this.bookingEndAt = bookingEndAt;
    this.startAt = startAt;
    this.endAt = endAt;
  }

  @IsDate()
  bookingStartAt: Date;

  @IsDate()
  bookingEndAt: Date;

  @IsDate()
  startAt: Date;

  @IsDate()
  endAt: Date;

  toUseCaseDTO(concertId: number): CreateConcertScheduleUseCaseDTO {
    return new CreateConcertScheduleUseCaseDTO(concertId, this.bookingStartAt, this.bookingEndAt, this.startAt, this.endAt);
  }
}
