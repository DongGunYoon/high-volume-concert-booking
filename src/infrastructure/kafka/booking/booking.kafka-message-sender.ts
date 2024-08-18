import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

@Injectable()
export class BookingKafkaMessageSender {
  constructor(@Inject('BOOKING_SERVICE') private readonly bookingClient: ClientKafka) {}

  sendMessage(topic: string, outbox: Outbox): void {
    this.bookingClient.emit(topic, JSON.stringify(outbox));
  }
}
