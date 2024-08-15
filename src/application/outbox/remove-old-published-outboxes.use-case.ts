import { Injectable } from '@nestjs/common';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';

@Injectable()
export class RemoveOldPublishedOutboxesUseCase {
  constructor(private readonly outboxService: OutboxService) {}

  async execute(): Promise<void> {
    await this.outboxService.removeOldPublishedOutboxes();
  }
}
