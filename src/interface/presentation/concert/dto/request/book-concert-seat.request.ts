import { IsInt } from 'class-validator';
import { BookConcertSeatUseCaseDTO } from 'src/application/concert/dto/book-concert-seat.use-case.dto';

export class BookConcertSeatRequest {
  constructor(concertScheduleId: number) {
    this.concertScheduleId = concertScheduleId;
  }

  @IsInt()
  concertScheduleId: number;

  toUseCaseDTO(userId: number, concertSeatId: number): BookConcertSeatUseCaseDTO {
    return new BookConcertSeatUseCaseDTO(userId, this.concertScheduleId, concertSeatId);
  }
}
