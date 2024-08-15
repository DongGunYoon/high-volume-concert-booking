import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

@Injectable()
export class OutboxKafkaMessageSender {
  constructor(@Inject('OUTBOX_SERVICE') private readonly outboxClient: ClientKafka) {}

  sendMessage(topic: string, outbox: Outbox): void {
    this.outboxClient.emit(topic, JSON.stringify(outbox));
  }
}
