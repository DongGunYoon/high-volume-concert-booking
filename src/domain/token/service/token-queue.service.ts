import { Nullable } from './../../../common/type/native';
import { Injectable } from '@nestjs/common';
import { TokenQueue } from '../../token/model/token-queue.domain';
import { WaitingTokenQueueRepository } from 'src/infrastructure/token/waiting-token-queue.repository.impl';
import { ActiveTokenQueueRepository } from 'src/infrastructure/token/active-token-queue.repository.impl';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

@Injectable()
export class TokenQueueService {
  private readonly QUEUE_THROUGHPUT = 2000;

  constructor(
    private readonly waitingTokenQueueRepository: WaitingTokenQueueRepository,
    private readonly activeTokenQueueRepository: ActiveTokenQueueRepository,
  ) {}

  async addWaitingToken(userId: number): Promise<TokenQueue> {
    let order = await this.waitingTokenQueueRepository.getOrder(userId.toString());

    if (order == null) {
      await this.waitingTokenQueueRepository.add(userId.toString());
      order = await this.waitingTokenQueueRepository.getSize();
    }

    return TokenQueue.createWaiting(userId, order);
  }

  async getWaitingToken(userId: number): Promise<TokenQueue> {
    const order = await this.waitingTokenQueueRepository.getOrder(userId.toString());

    if (!order) {
      throw new CustomException(ErrorCode.WAITING_TOKEN_NOT_FOUND);
    }

    return TokenQueue.createWaiting(userId, order);
  }

  async getActiveToken(userId: number): Promise<Nullable<TokenQueue>> {
    const token = await this.activeTokenQueueRepository.findOne(userId.toString());

    if (!token) return null;

    return TokenQueue.createActive(token);
  }

  async activateQueues(): Promise<void> {
    const userIds = await this.waitingTokenQueueRepository.findOldest(this.QUEUE_THROUGHPUT);

    if (userIds.length == 0) return;

    userIds.forEach(async userId => {
      await this.activeTokenQueueRepository.add(userId, TokenQueue.generateToken(parseInt(userId)));
    });

    await this.waitingTokenQueueRepository.remove(userIds);
  }

  async expire(id: number): Promise<void> {
    await this.activeTokenQueueRepository.remove(id.toString());
  }
}
