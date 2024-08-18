import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { OutboxModule } from 'src/module/outbox.module';
import { Repository } from 'typeorm';
import { OutboxEntity } from 'src/infrastructure/outbox/outbox.entity';
import { OutboxStatus } from 'src/domain/outbox/enum/outbox.enum';
import { RemoveOldPublishedOutboxesUseCase } from 'src/application/outbox/remove-old-published-outboxes.use-case';

describe('RemoveOldPublishedOutboxesUseCase', () => {
  let module: TestingModule;
  let removeOldPublishedOutboxesUseCase: RemoveOldPublishedOutboxesUseCase;
  let outboxRepository: Repository<OutboxEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), OutboxModule],
    }).compile();

    removeOldPublishedOutboxesUseCase = module.get(RemoveOldPublishedOutboxesUseCase);
    outboxRepository = module.get(getRepositoryToken(OutboxEntity));
  });

  beforeEach(() => {
    outboxRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('오래된 발행 아웃박스 삭제 테스트', () => {
    it('모든 아웃박스가 INIT 상태라면, 삭제가 진행되지 않습니다.', async () => {
      // Given
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.INIT, createdAt: new Date() },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.INIT, createdAt: new Date() },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.INIT, createdAt: new Date() },
      ]);

      // When
      await removeOldPublishedOutboxesUseCase.execute();

      // Then
      const outboxes = await outboxRepository.find();
      expect(outboxes).toHaveLength(3);
    });

    it('10일 이상 지난 Published 상태의 아웃박스가 있다면, 해당하는 개수만큼 삭제가 이루어집니다.', async () => {
      // Given
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.INIT, createdAt: pastDate },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.PUBLISHED, createdAt: new Date() },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.PUBLISHED, createdAt: pastDate },
      ]);

      // When
      await removeOldPublishedOutboxesUseCase.execute();

      // Then
      const outboxes = await outboxRepository.find();
      expect(outboxes).toHaveLength(2);
    });
  });
});
