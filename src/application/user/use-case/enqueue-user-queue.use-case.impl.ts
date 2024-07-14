import { Injectable } from '@nestjs/common';
import { EnqueueUserQueueUseCase } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';

@Injectable()
export class EnqueueUserQueueUseCaseImpl implements EnqueueUserQueueUseCase {
  constructor(private readonly userQueueService: UserQueueService) {}

  async execute(userId: number): Promise<UserQueue> {
    const userQueue = await this.userQueueService.upsert(userId);

    if (userQueue.token) return userQueue;

    await this.userQueueService.calculateOrder(userQueue);

    return userQueue;
  }
}
