import { Injectable } from '@nestjs/common';
import { TokenQueueService } from 'src/domain/token/service/token-queue.service';

@Injectable()
export class ActivateTokenQueuesUseCase {
  constructor(private readonly tokenQueueService: TokenQueueService) {}

  async execute(): Promise<void> {
    await this.tokenQueueService.activateQueues();
  }
}
