import { Injectable } from '@nestjs/common';
import { TokenQueue } from 'src/domain/token/model/token-queue.domain';
import { TokenQueueService } from 'src/domain/token/service/token-queue.service';

@Injectable()
export class ScanTokenQueueUseCase {
  constructor(private readonly tokenQueueService: TokenQueueService) {}

  async execute(userId: number): Promise<TokenQueue> {
    const activeTokenQueue = await this.tokenQueueService.getActiveToken(userId);

    if (activeTokenQueue) return activeTokenQueue;

    return await this.tokenQueueService.getWaitingToken(userId);
  }
}
