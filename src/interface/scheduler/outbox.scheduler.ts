import { HandleFailedOutboxesUseCase } from '../../application/outbox/handle-failed-outboxes.use-case';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RemoveOldPublishedOutboxesUseCase } from 'src/application/outbox/remove-old-published-outboxes.use-case';

@Injectable()
export class OutboxScheduler {
  constructor(
    private readonly handleFailedOutboxesUseCase: HandleFailedOutboxesUseCase,
    private readonly removeOldPublishedOutboxesUseCase: RemoveOldPublishedOutboxesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleFailedOutboxes() {
    await this.handleFailedOutboxesUseCase.execute();
  }

  @Cron(CronExpression.EVERY_WEEK)
  async removeOldPublishedOutboxes() {
    await this.removeOldPublishedOutboxesUseCase.execute();
  }
}
