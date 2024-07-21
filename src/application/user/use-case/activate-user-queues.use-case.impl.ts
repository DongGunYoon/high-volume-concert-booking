import { Injectable } from '@nestjs/common';
import { ActivateUserQueuesUseCase } from 'src/domain/user/interface/use-case/activae-user-queues.use-case';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';

@Injectable()
export class ActivateUserQueuesUseCaseImpl implements ActivateUserQueuesUseCase {
  constructor(private readonly userQueueService: UserQueueService) {}

  async execute(): Promise<void> {
    await this.userQueueService.activateQueues();
  }
}
