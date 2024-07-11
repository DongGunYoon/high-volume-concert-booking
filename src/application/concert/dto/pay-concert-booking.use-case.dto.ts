import { CreatePaymentDTO } from 'src/domain/concert/dto/create-payment.dto';
import { PayConcertBookingDTO } from 'src/domain/concert/dto/pay-concert-booking.dto';
import { ConcertPaymentType } from 'src/domain/concert/enum/concert.enum';
import { PayPointDTO } from 'src/domain/point/dto/charge-point.dto';
import { CreatePointHistoryDTO } from 'src/domain/point/dto/create-point-history.dto';
import { PointTransactionType } from 'src/domain/point/enum/point.enum';

export class PayConcertBookingUseCaseDTO {
  userId: number;
  userQueueId: number;
  concertBookingId: number;

  constructor(userId: number, userQueueId: number, concertBookingId: number) {
    this.userId = userId;
    this.userQueueId = userQueueId;
    this.concertBookingId = concertBookingId;
  }

  toPayBookingDTO(): PayConcertBookingDTO {
    return {
      userId: this.userId,
      concertBookingId: this.concertBookingId,
    };
  }

  toPayPointDTO(price: number): PayPointDTO {
    return {
      userId: this.userId,
      amount: price,
    };
  }

  toCreatePointHistoryDTO(pointId: number, price: number): CreatePointHistoryDTO {
    return {
      userId: this.userId,
      pointId: pointId,
      amount: price,
      transactionType: PointTransactionType.USE,
    };
  }

  toCreatePaymentDTO(concertId: number, concertScheduleId: number, concertSeatId: number, price: number): CreatePaymentDTO {
    return {
      userId: this.userId,
      concertId: concertId,
      concertScheduleId: concertScheduleId,
      concertSeatId: concertSeatId,
      concertBookingId: this.concertBookingId,
      price: price,
      type: ConcertPaymentType.BUY,
    };
  }
}
