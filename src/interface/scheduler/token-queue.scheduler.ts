import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';
import { ActivateTokenQueuesUseCase } from 'src/application/token/activate-token-queues.use-case.impl';

@Injectable()
export class TokenQueueScheduler {
  constructor(private readonly activateTokenQueuesUseCase: ActivateTokenQueuesUseCase) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processQueue(): Promise<void> {
    await this.activateTokenQueuesUseCase.execute();
  }
}
