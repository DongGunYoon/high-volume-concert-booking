import { Injectable } from '@nestjs/common';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';
import { OutboxKafkaMessageSender } from 'src/infrastructure/kafka/outbox/outbox.kafka-message-sender';

@Injectable()
export class HandleFailedOutboxesUseCase {
  constructor(
    private readonly outboxService: OutboxService,
    private readonly messageSender: OutboxKafkaMessageSender,
  ) {}

  async execute(): Promise<void> {
    const failedOutboxes = await this.outboxService.findFailed();

    failedOutboxes.forEach(outbox => this.messageSender.sendMessage(outbox.topic, outbox));
  }
}
