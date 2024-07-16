import { Nullable } from 'src/common/type/native';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';

export class UserQueueResponse {
  constructor(
    public id: number,
    public userId: number,
    public currentOrder: number,
    public token: Nullable<string>,
    public expiresAt: Nullable<Date>,
  ) {}

  static from(userQueue: UserQueue & { currentOrder: number }): UserQueueResponse {
    return new UserQueueResponse(userQueue.id, userQueue.userId, userQueue.currentOrder, userQueue.token, userQueue.expiresAt);
  }
}
