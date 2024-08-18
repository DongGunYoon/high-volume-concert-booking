import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCompletedEvent } from './booking-completed.event';
import { BookingKafkaMessageSender } from 'src/infrastructure/kafka/booking/booking.kafka-message-sender';
import { EventTrasactionId } from 'src/common/enum/event.enum';

@Injectable()
@EventsHandler(BookingCompletedEvent)
export class BookingCompletedHandler implements IEventHandler<BookingCompletedEvent> {
  constructor(private readonly messageSender: BookingKafkaMessageSender) {}

  async handle(event: BookingCompletedEvent) {
    try {
      await this.messageSender.sendMessage(event.outbox.topic, event.outbox);
    } catch (error) {
      if (event.transactionId === EventTrasactionId.CONCERT_BOOKING_COMPLETED) {
        // 보상 트랜잭션이 존재 시, 작성
      }
    }
  }
}
