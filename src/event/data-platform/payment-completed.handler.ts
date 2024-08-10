import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { PaymentCompletedEvent } from '../payment/payment-completed.event';
import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';

@EventsHandler(PaymentCompletedEvent)
export class DataPlatformBookingCompletedHandler implements IEventHandler<PaymentCompletedEvent> {
  constructor(private readonly dataPlatformService: DataPlatformService) {}

  async handle(event: PaymentCompletedEvent) {
    try {
      await this.dataPlatformService.sendPaymentResult(event.payment);
    } catch (error) {
      if (event.transactionId === EventTrasactionIdEnum.CONCERT_PAYMENT_COMPLETED) {
        // 보상 트랜잭션이 존재 시, 작성
      }
    }
  }
}
