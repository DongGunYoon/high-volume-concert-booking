import { Nullable } from 'src/common/type/native';
import { TokenQueue } from 'src/domain/token/model/token-queue.domain';

export class TokenQueueResponse {
  constructor(
    public userId: number,
    public token: Nullable<string>,
    public order: number,
    public estimateWaitingSec: number,
  ) {}

  static from(tokenQueue: TokenQueue): TokenQueueResponse {
    return new TokenQueueResponse(tokenQueue.userId, tokenQueue.token, tokenQueue.order, tokenQueue.estimateWaitingSec);
  }
}
