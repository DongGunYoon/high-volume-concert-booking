import { CreateConcertBookingDTO } from 'src/domain/concert/dto/create-concert-booking.dto';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { CreateOutboxDTO } from 'src/domain/outbox/dto/create-outbox.dto';

export class BookConcertSeatUseCaseDTO {
  userId: number;
  concertScheduleId: number;
  concertSeatId: number;

  constructor(userId: number, concertScheduleId: number, concertSeatId: number) {
    this.userId = userId;
    this.concertScheduleId = concertScheduleId;
    this.concertSeatId = concertSeatId;
  }

  toCreateConcertBookingDTO(concertId: number, price: number): CreateConcertBookingDTO {
    return {
      userId: this.userId,
      concertId: concertId,
      concertScheduleId: this.concertScheduleId,
      concertSeatId: this.concertSeatId,
      price: price,
    };
  }

  toCreateOutboxDTO(booking: ConcertBooking): CreateOutboxDTO {
    return {
      topic: 'booking.completed',
      message: JSON.stringify(booking),
    };
  }
}
