import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EnqueueUserQueueUseCase, EnqueueUserQueueUseCaseSymbol } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { User } from 'src/domain/user/model/user.domain';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { UserQueueEntity } from 'src/infrastructure/user/entity/user-queue.entity';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserQueueMapper } from 'src/infrastructure/user/mapper/user-queue.mapper';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { AuthModule } from 'src/module/auth.module';
import { UserModule } from 'src/module/user.module';
import { Repository } from 'typeorm';

describe('EnqueueUserQueueUseCase', () => {
  let module: TestingModule;
  let enqueueUserQueueUseCase: EnqueueUserQueueUseCase;
  let userRepository: Repository<UserEntity>;
  let userQueueRepository: Repository<UserQueueEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), UserModule, AuthModule],
    }).compile();

    enqueueUserQueueUseCase = module.get<EnqueueUserQueueUseCase>(EnqueueUserQueueUseCaseSymbol);
    userRepository = module.get(getRepositoryToken(UserEntity));
    userQueueRepository = module.get(getRepositoryToken(UserQueueEntity));
  });

  beforeEach(async () => {
    await userQueueRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('유저 대기열 진입 요청', () => {
    it('대기열에 아무도 없다면 대기번호 1을 획득합니다.', async () => {
      // Given
      const user = await createUser('유저');

      // When
      const userQueue = await enqueueUserQueueUseCase.execute(user.id);

      // Then
      expect(userQueue).toBeInstanceOf(UserQueue);
      expect(userQueue.currentOrder).toBe(1);
    });

    it('대기열에 이미 추가된 대기자가 있다면 앞선 유저들 뒤에 대기번호를 획득한다', async () => {
      // Given
      const firstUser = await createUser('유저1');
      const secondUser = await createUser('유저2');
      await createPendingUserQueue(firstUser.id);

      // When
      const userQueue = await enqueueUserQueueUseCase.execute(secondUser.id);

      // Then
      expect(userQueue).toBeInstanceOf(UserQueue);
      expect(userQueue.currentOrder).toBe(2);
    });

    it('활성화된 토큰이 발급된 유저는 해당 토큰이 담긴 대기열 정보를 획득한다.', async () => {
      // Given
      const user = await createUser('유저');
      const tokenIssuedUserQueue = await createTokenIssuedUserQueue(user.id);

      // When
      const userQueue = await enqueueUserQueueUseCase.execute(user.id);

      // Then
      expect(userQueue).toBeInstanceOf(UserQueue);
      expect(userQueue.token).toBe(tokenIssuedUserQueue.token);
      expect(userQueue.currentOrder).toBe(0);
    });
  });

  const createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await userRepository.save(user));
  };

  const createPendingUserQueue = async (userId: number): Promise<UserQueue> => {
    const userQueue = UserQueueMapper.toEntity(new UserQueue(0, userId, null, null));

    return UserQueueMapper.toDomain(await userQueueRepository.save(userQueue));
  };

  const createTokenIssuedUserQueue = async (userId: number): Promise<UserQueue> => {
    const userQueue = UserQueueMapper.toEntity(new UserQueue(0, userId, 'token', new Date(Date.now() + 10000)));

    return UserQueueMapper.toDomain(await userQueueRepository.save(userQueue));
  };
});
