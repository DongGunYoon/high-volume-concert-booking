import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

@Injectable()
export class PaymentKafkaMessageSender {
  constructor(@Inject('PAYMENT_SERVICE') private readonly kafkaClient: ClientKafka) {}

  sendMessage(topic: string, outbox: Outbox): void {
    this.kafkaClient.emit(topic, JSON.stringify(outbox));
  }
}
