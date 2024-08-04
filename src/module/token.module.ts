import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivateTokenQueuesUseCase } from 'src/application/token/activate-token-queues.use-case.impl';
import { EnqueueTokenQueueUseCase } from 'src/application/token/enqueue-token-queue.use-case.impl';
import { ScanTokenQueueUseCase } from 'src/application/token/scan-token-queue.use-case.impl';
import { TokenQueueService } from 'src/domain/token/service/token-queue.service';
import { ActiveTokenQueueRepository } from 'src/infrastructure/token/active-token-queue.repository.impl';
import { WaitingTokenQueueRepository } from 'src/infrastructure/token/waiting-token-queue.repository.impl';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { TokenController } from 'src/interface/presentation/token/controller/token.controller';
import { TokenQueueScheduler } from 'src/interface/scheduler/token-queue.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [TokenController],
  providers: [
    TokenQueueScheduler,
    EnqueueTokenQueueUseCase,
    ScanTokenQueueUseCase,
    ActivateTokenQueuesUseCase,
    TokenQueueService,
    WaitingTokenQueueRepository,
    ActiveTokenQueueRepository,
  ],
})
export class TokenModule {}
