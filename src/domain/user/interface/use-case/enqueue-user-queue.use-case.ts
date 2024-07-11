import { UserQueue } from 'src/domain/user/model/user-queue.domain';

export const EnqueueUserQueueUseCaseSymbol = Symbol.for('EnqueueUserQueueUseCase');

export interface EnqueueUserQueueUseCase {
  execute(userId: number): Promise<UserQueue & { currentOrder: number }>;
}
