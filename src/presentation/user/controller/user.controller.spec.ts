import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserQueueResponse } from '../dto/response/user-queue.response';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('유저 대기열 토큰 요청', () => {
    it('유저가 대기열 토큰을 요청합니다.', async () => {
      // Given
      const userId = 1;

      // When
      const userQueue = await userController.issueUserQueue();

      // Then
      expect(userQueue).toBeInstanceOf(UserQueueResponse);
      expect(userQueue.userId).toBe(userId);
      expect(userQueue.currentOrder).toBe(0);
      expect(userQueue.token).toBe('token-example');
    });
  });
});
