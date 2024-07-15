import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ReadPointUseCase, ReadPointUseCaseSymbol } from 'src/domain/point/interface/use-case/read-point.use-case';
import { Point } from 'src/domain/point/model/point.domain';
import { User } from 'src/domain/user/model/user.domain';
import { TestTypeORMConfig } from 'src/infrastructure/database/config/test-typeorm.config';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { AuthModule } from 'src/module/auth.module';
import { PointModule } from 'src/module/point.module';
import { Repository } from 'typeorm';

describe('ReadPointUseCase', () => {
  let module: TestingModule;
  let readPointUseCase: ReadPointUseCase;
  let userRepository: Repository<UserEntity>;
  let pointRepository: Repository<PointEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), PointModule, AuthModule],
    }).compile();

    readPointUseCase = module.get<ReadPointUseCase>(ReadPointUseCaseSymbol);
    userRepository = module.get(getRepositoryToken(UserEntity));
    pointRepository = module.get(getRepositoryToken(PointEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('포인트 조회 성공', () => {
    it('새로 가입한 유저의 포인트는 0원으로 조회됩니다.', async () => {
      // Given
      const user = await createUser('유저');

      // When
      const point = await readPointUseCase.execute(user.id);

      // Then
      expect(point).toBeInstanceOf(Point);
      expect(point.userId).toBe(user.id);
      expect(point.amount).toBe(0);
    });

    it('유저의 포인트가 있다면, 해당 포인트를 조회합니다.', async () => {
      // Given
      const user = await createUser('유저');
      await setPoint(user.id, 1000);

      // When
      const point = await readPointUseCase.execute(user.id);

      // Then
      expect(point).toBeInstanceOf(Point);
      expect(point.userId).toBe(user.id);
      expect(point.amount).toBe(1000);
    });
  });

  const createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await userRepository.save(user));
  };

  const setPoint = async (userId: number, amount: number): Promise<void> => {
    await pointRepository.update({ userId }, { amount });
  };
});
