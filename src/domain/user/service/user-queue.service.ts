import { Inject, Injectable } from '@nestjs/common';
import { UserQueueRepository, UserQueueRepositorySymbol } from '../interface/repository/user-queue.repository';
import { UserQueue } from '../model/user-queue.domain';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

@Injectable()
export class UserQueueService {
  constructor(@Inject(UserQueueRepositorySymbol) private readonly userQueueRepository: UserQueueRepository) {}

  async upsert(userId: number): Promise<UserQueue> {
    const unexpiredQueue = await this.userQueueRepository.findUnexpiredByUserId(userId);

    if (unexpiredQueue) return unexpiredQueue;

    return await this.userQueueRepository.save(UserQueue.create(userId));
  }

  async getByIdOrThrow(id: number): Promise<UserQueue> {
    const userQueue = await this.userQueueRepository.findOneById(id);

    if (!userQueue) {
      throw new CustomException(ErrorCode.QUEUE_NOT_FOUND);
    }

    return userQueue;
  }

  async calculateOrder(userQueue: UserQueue): Promise<void> {
    const oldestPendingQueue = await this.userQueueRepository.findOldestPending();

    userQueue.setCurrentOrder(oldestPendingQueue && oldestPendingQueue.id);
  }

  async activateQueues(): Promise<void> {
    const pendingQueues = await this.userQueueRepository.findPendingQueues(100);

    pendingQueues.forEach(queue => queue.activate());

    await this.userQueueRepository.bulkSave(pendingQueues);
  }

  async expire(id: number): Promise<void> {
    await this.userQueueRepository.expireById(id);
  }
}
