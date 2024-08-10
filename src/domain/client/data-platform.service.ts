import { Inject, Injectable } from '@nestjs/common';
import { DataPlatformClient, DataPlatformClientSymbol } from './data-platform.client';
import { ConcertBooking } from '../concert/model/concert-booking.domain';
import { ConcertPayment } from '../concert/model/concert-payment.domain';

@Injectable()
export class DataPlatformService {
  constructor(@Inject(DataPlatformClientSymbol) private readonly dataPlatformClient: DataPlatformClient) {}

  async sendBookingResult(booking: ConcertBooking): Promise<void> {
    await this.dataPlatformClient.sendBookingResult(booking);
  }

  async sendPaymentResult(payment: ConcertPayment): Promise<void> {
    await this.dataPlatformClient.sendPaymentResult(payment);
  }
}
