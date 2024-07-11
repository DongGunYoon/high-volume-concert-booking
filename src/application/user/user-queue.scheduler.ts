import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserQueueScheduler {
  constructor(private readonly userQueueService: UserQueueService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processQueue(): Promise<void> {
    await this.userQueueService.activateQueues();
  }
}
