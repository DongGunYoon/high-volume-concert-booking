import { Test } from '@nestjs/testing';
import { UserController } from '../../../src/presentation/user/controller/user.controller';
import { UserQueueResponse } from '../../../src/presentation/user/dto/response/user-queue.response';
import { EnqueueUserQueueUseCase, EnqueueUserQueueUseCaseSymbol } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { UserAuthGuard } from 'src/domain/auth/guard/auth.guard';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let userController: UserController;
  let enqueueUserQueueUseCase: EnqueueUserQueueUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: EnqueueUserQueueUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        {
          provide: UserAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    enqueueUserQueueUseCase = module.get<EnqueueUserQueueUseCase>(EnqueueUserQueueUseCaseSymbol);
  });

  describe('유저 대기열 토큰 요청', () => {
    it('유저가 대기열 토큰을 요청합니다.', async () => {
      // Given
      const userQueue = new UserQueue(1, 1, null, null, 100);
      jest.spyOn(enqueueUserQueueUseCase, 'execute').mockResolvedValue(userQueue);

      // When
      const response = await userController.enqueueUserQueue({ userId: 1 });

      // Then
      expect(response).toBeInstanceOf(UserQueueResponse);
      expect(response.userId).toBe(1);
      expect(response.currentOrder).toBe(100);
      expect(response.token).toBeNull();
    });
  });
});
