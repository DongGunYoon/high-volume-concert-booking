import { ConcertPaymentType } from '../enum/concert.enum';

export type CreatePaymentDTO = {
  userId: number;
  concertId: number;
  concertScheduleId: number;
  concertSeatId: number;
  concertBookingId: number;
  price: number;
  type: ConcertPaymentType;
};
