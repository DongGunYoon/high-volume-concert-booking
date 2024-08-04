import { PayConcertBookingUseCaseDTO } from 'src/application/concert/dto/pay-concert-booking.use-case.dto';

export class PayConcertBookingRequest {
  toUseCaseDTO(userId: number, concertBookingId: number): PayConcertBookingUseCaseDTO {
    return new PayConcertBookingUseCaseDTO(userId, concertBookingId);
  }
}
