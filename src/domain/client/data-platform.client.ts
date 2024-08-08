import { ConcertBooking } from '../concert/model/concert-booking.domain';
import { ConcertPayment } from '../concert/model/concert-payment.domain';

export const DataPlatformClientSymbol = Symbol.for('DataPlatformClient');

export interface DataPlatformClient {
  sendBookingResult(booking: ConcertBooking): Promise<void>;
  sendPaymentResult(payment: ConcertPayment): Promise<void>;
}
