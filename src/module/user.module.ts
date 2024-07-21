import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';
import { UserQueueRepositorySymbol } from 'src/domain/user/interface/repository/user-queue.repository';
import { UserQueueRepositoryImpl } from 'src/infrastructure/user/repository/user-queue.repository.impl';
import { UserQueueEntity } from 'src/infrastructure/user/entity/user-queue.entity';
import { EnqueueUserQueueUseCaseSymbol } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { EnqueueUserQueueUseCaseImpl } from 'src/application/user/use-case/enqueue-user-queue.use-case.impl';
import { UserController } from 'src/interface/presentation/user/controller/user.controller';
import { UserQueueScheduler } from 'src/interface/scheduler/user-queue.scheduler';
import { ActivateUserQueuesUseCaseImpl } from 'src/application/user/use-case/activate-user-queues.use-case.impl';
import { ActivateUserQueuesUseCaseSymbol } from 'src/domain/user/interface/use-case/activae-user-queues.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserQueueEntity])],
  controllers: [UserController],
  providers: [
    UserQueueService,
    UserQueueScheduler,
    { provide: ActivateUserQueuesUseCaseSymbol, useClass: ActivateUserQueuesUseCaseImpl },
    { provide: EnqueueUserQueueUseCaseSymbol, useClass: EnqueueUserQueueUseCaseImpl },
    { provide: UserQueueRepositorySymbol, useClass: UserQueueRepositoryImpl },
  ],
  exports: [UserQueueService],
})
export class UserModule {}
