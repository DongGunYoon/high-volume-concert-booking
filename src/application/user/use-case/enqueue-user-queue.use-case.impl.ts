import { Injectable } from '@nestjs/common';
import { EnqueueUserQueueUseCase } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';

@Injectable()
export class EnqueueUserQueueUseCaseImpl implements EnqueueUserQueueUseCase {
  constructor(private readonly userQueueService: UserQueueService) {}

  async execute(userId: number): Promise<UserQueue> {
    let userQueue = await this.userQueueService.getUnexpired(userId);

    if (!userQueue) {
      userQueue = await this.userQueueService.create(userId);
    }

    await this.userQueueService.calculateOrder(userQueue);

    return userQueue;
  }
}
