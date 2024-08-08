import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentCompletedEvent } from '../payment/payment-completed.event';
import { TokenQueueService } from 'src/domain/token/service/token-queue.service';
import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';

@EventsHandler(PaymentCompletedEvent)
export class TokenPaymentCompletedHandler implements IEventHandler<PaymentCompletedEvent> {
  constructor(private readonly tokenQueueService: TokenQueueService) {}

  async handle(event: PaymentCompletedEvent) {
    try {
      await this.tokenQueueService.expire(event.payment.userId);
    } catch (error) {
      if (event.transactionId === EventTrasactionIdEnum.CONCERT_PAYMENT_COMPLETED) {
        // 보상 트랜잭션이 존재 시, 작성
      }
    }
  }
}
