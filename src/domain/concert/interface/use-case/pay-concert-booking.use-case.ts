import { PayConcertBookingUseCaseDTO } from 'src/application/concert/dto/pay-concert-booking.use-case.dto';
import { ConcertPayment } from '../../model/concert-payment.domain';

export const PayConcertBookingUseCaseSymbol = Symbol.for('PayConcertBookingUseCase');

export interface PayConcertBookingUseCase {
  execute(dto: PayConcertBookingUseCaseDTO): Promise<ConcertPayment>;
}
