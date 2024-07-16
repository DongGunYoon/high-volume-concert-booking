import { Nullable } from 'src/common/type/native';
import { UserQueue } from '../../model/user-queue.domain';

export const UserQueueRepositorySymbol = Symbol.for('UserQueueRepository');

export interface UserQueueRepository {
  findOldestPending(): Promise<Nullable<UserQueue>>;
  findPendingQueues(count: number): Promise<UserQueue[]>;
  findUnexpiredByUserId(userId: number): Promise<Nullable<UserQueue>>;
  findOneById(id: number): Promise<Nullable<UserQueue>>;
  expireById(id: number): Promise<void>;
  save(userQueue: UserQueue): Promise<UserQueue>;
  bulkSave(userQueues: UserQueue[]): Promise<UserQueue[]>;
}
