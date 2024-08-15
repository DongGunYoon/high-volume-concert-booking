import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventTrasactionId } from 'src/common/enum/event.enum';
import { PaymentCompletedEvent } from './payment-completed.event';
import { PaymentKafkaMessageSender } from 'src/infrastructure/kafka/payment/payment.kafka-message-sender';

@Injectable()
@EventsHandler(PaymentCompletedEvent)
export class PaymentCompletedHandler implements IEventHandler<PaymentCompletedEvent> {
  constructor(private readonly messageSender: PaymentKafkaMessageSender) {}

  async handle(event: PaymentCompletedEvent) {
    try {
      await this.messageSender.sendMessage(event.outbox.topic, event.outbox);
    } catch (error) {
      if (event.transactionId === EventTrasactionId.CONCERT_PAYMENT_COMPLETED) {
        // 보상 트랜잭션이 존재 시, 작성
      }
    }
  }
}
