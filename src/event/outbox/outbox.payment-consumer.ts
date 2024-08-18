import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';

@Injectable()
export class OutboxPaymentConsumer {
  constructor(private readonly outboxService: OutboxService) {}

  @EventPattern('payment.completed')
  async handleOutboxStatus(@Payload() data: { value: Outbox }) {
    await this.outboxService.toPublished(data.value.id);
  }
}
