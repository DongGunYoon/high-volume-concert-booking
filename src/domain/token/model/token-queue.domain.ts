import { Nullable } from 'src/common/type/native';
import * as jwt from 'jsonwebtoken';

export class TokenQueue {
  static THROUGHPUT_PER_10_SEC = 2000;

  constructor(
    public userId: number,
    public token: Nullable<string>,
    public order: number,
    public estimateWaitingSec: number,
  ) {}

  static createActive(token: string): TokenQueue {
    const decoded = jwt.decode(token) as { userId: number };

    return new TokenQueue(decoded.userId, token, 0, 0);
  }

  static createWaiting(userId: number, order: number): TokenQueue {
    const estimatedWaitingSec = Math.ceil(order / TokenQueue.THROUGHPUT_PER_10_SEC) * 10;

    return new TokenQueue(userId, null, order, estimatedWaitingSec);
  }

  static generateToken(userId: number): string {
    return jwt.sign(
      {
        userId: userId,
      },
      process.env.JWT_TOKEN_QUEUE_SECRET!,
      { expiresIn: '5m' },
    );
  }
}
