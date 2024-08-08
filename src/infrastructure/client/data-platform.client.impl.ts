import { Injectable } from '@nestjs/common';
import { DataPlatformClient } from 'src/domain/client/data-platform.client';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';

@Injectable()
export class DataPlatformClientImpl implements DataPlatformClient {
  async sendBookingResult(booking: ConcertBooking): Promise<void> {
    // 외부 API 1초 통신 대기 가정
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async sendPaymentResult(payment: ConcertPayment): Promise<void> {
    // 외부 API 1초 통신 대기 가정
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
