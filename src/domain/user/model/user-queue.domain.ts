import { Nullable } from 'src/common/type/native';
import * as jwt from 'jsonwebtoken';

export class UserQueue {
  constructor(
    public id: number,
    public userId: number,
    public token: Nullable<string>,
    public expiresAt: Nullable<Date>,
    public currentOrder: number = 0,
  ) {}

  static create(userId: number): UserQueue {
    return new UserQueue(0, userId, null, null);
  }

  calculateCurrentOrder(oldestPendingId: Nullable<number>): void {
    if (oldestPendingId) {
      this.currentOrder = this.id - oldestPendingId + 1;
    } else {
      this.currentOrder = 1;
    }
  }

  activate(): void {
    this.token = jwt.sign(
      {
        userId: this.userId,
        userQueueId: this.id,
      },
      process.env.JWT_USER_QUEUE_SECRET || 'test',
      { expiresIn: '10m' },
    );
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  }

  isActive(): boolean {
    return !!(this.token && this.expiresAt && this.expiresAt > new Date());
  }
}
