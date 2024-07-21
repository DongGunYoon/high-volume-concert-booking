import { ActivateUserQueuesUseCase, ActivateUserQueuesUseCaseSymbol } from './../../domain/user/interface/use-case/activae-user-queues.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserQueueScheduler {
  constructor(@Inject(ActivateUserQueuesUseCaseSymbol) private readonly activateUserQueuesUseCase: ActivateUserQueuesUseCase) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processQueue(): Promise<void> {
    await this.activateUserQueuesUseCase.execute();
  }
}
