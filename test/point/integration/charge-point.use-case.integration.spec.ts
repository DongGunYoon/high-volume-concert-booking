import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ChargePointUseCaseDTO } from 'src/application/point/dto/charge-point.use-case.dto';
import { PointTransactionType } from 'src/domain/point/enum/point.enum';
import { ChargePointUseCase, ChargePointUseCaseSymbol } from 'src/domain/point/interface/use-case/charge-point.use-case';
import { Point } from 'src/domain/point/model/point.domain';
import { User } from 'src/domain/user/model/user.domain';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { PointHistoryEntity } from 'src/infrastructure/point/entity/point-history.entity';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { AuthModule } from 'src/module/auth.module';
import { PointModule } from 'src/module/point.module';
import { Repository } from 'typeorm';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';

describe('ChargePointUseCase', () => {
  let module: TestingModule;
  let chargePointUseCase: ChargePointUseCase;
  let userRepository: Repository<UserEntity>;
  let pointRepository: Repository<Point>;
  let pointHistoryRepository: Repository<PointHistoryEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), PointModule, AuthModule],
    }).compile();

    chargePointUseCase = module.get<ChargePointUseCase>(ChargePointUseCaseSymbol);
    userRepository = module.get(getRepositoryToken(UserEntity));
    pointRepository = module.get(getRepositoryToken(PointEntity));
    pointHistoryRepository = module.get(getRepositoryToken(PointHistoryEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('포인트 충전 성공', () => {
    it('포인트 충전 성공 시, 충전된 포인트가 반환됩니다.', async () => {
      // Given
      const user = await createUser('유저');

      // When
      const chargedPoint = await chargePointUseCase.execute(new ChargePointUseCaseDTO(user.id, 1000));

      // Then
      expect(chargedPoint).toBeInstanceOf(Point);
      expect(chargedPoint.userId).toBe(user.id);
      expect(chargedPoint.amount).toBe(1000);
    });

    it('포인트 충전 성공 시, 포인트 충전 내역이 쌓입니다.', async () => {
      // Given
      const user = await createUser('유저');

      // When
      const chargedPoint = await chargePointUseCase.execute(new ChargePointUseCaseDTO(user.id, 1000));

      // Then
      const pointHistory = await pointHistoryRepository.findOneBy({ pointId: chargedPoint.id });
      expect(pointHistory).not.toBeNull();
      expect(pointHistory!.userId).toBe(user.id);
      expect(pointHistory!.amount).toBe(1000);
      expect(pointHistory!.transactionType).toBe(PointTransactionType.CHARGE);
    });
  });

  describe('포인트 충전 실패', () => {
    it('충전 금액이 0원 이하일 때, 에러가 발생합니다.', async () => {
      // Given
      const user = await createUser('유저');

      // When
      const chargeNegativeAmount = async () => await chargePointUseCase.execute(new ChargePointUseCaseDTO(user.id, -1000));

      // Then
      await expect(chargeNegativeAmount).rejects.toThrow('충전 금액은 최소 0원 이상이어야 합니다.');
    });
  });

  describe('포인트 충전 동시성 테스트', () => {
    it(`100번의 충전이 발생한다면, 100번의 충전 금액이 모두 증가해야 합니다.`, async () => {
      // Given
      const user = await createUser('유저');
      const charge = (amount: number) => chargePointUseCase.execute(new ChargePointUseCaseDTO(user.id, amount));

      // When
      await Promise.all(Array.from({ length: 100 }, () => charge(100)));

      // Then
      const point = await pointRepository.findOneByOrFail({ userId: user.id });
      expect(point.amount).toBe(10000);
    });

    it(`100번의 충전이 발생한다면, 100건의 충전 내역이 쌓여야 합니다.`, async () => {
      // Given
      const user = await createUser('유저');
      const charge = (amount: number) => chargePointUseCase.execute(new ChargePointUseCaseDTO(user.id, amount));

      // When
      await Promise.all(Array.from({ length: 100 }, () => charge(100)));

      // Then
      const pointHistoryCount = await pointHistoryRepository.countBy({ userId: user.id });
      expect(pointHistoryCount).toBe(100);
    });
  });

  const createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await userRepository.save(user));
  };
});
