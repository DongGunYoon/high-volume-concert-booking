import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { OutboxModule } from 'src/module/outbox.module';
import { Repository } from 'typeorm';
import { OutboxEntity } from 'src/infrastructure/outbox/outbox.entity';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';
import { OutboxStatus } from 'src/domain/outbox/enum/outbox.enum';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

describe('OutboxService', () => {
  let module: TestingModule;
  let outboxService: OutboxService;
  let outboxRepository: Repository<OutboxEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), OutboxModule],
    }).compile();

    outboxService = module.get<OutboxService>(OutboxService);
    outboxRepository = module.get(getRepositoryToken(OutboxEntity));
  });

  beforeEach(() => {
    outboxRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('아웃박스 생성', () => {
    it('아웃박스를 생성하면 INIT 상태로 저장됩니다.', async () => {
      // Given
      const topic = 'topic';
      const message = 'message';

      // When
      const outbox = await outboxService.create({ topic, message });

      // Then
      expect(outbox).toBeInstanceOf(Outbox);
      expect(outbox.status).toBe(OutboxStatus.INIT);
      expect(outbox.topic).toBe(topic);
      expect(outbox.message).toBe(message);
    });
  });

  describe('아웃박스 상태 변경', () => {
    it('아웃박스 상태를 PUBLISHED로 변경할 수 있습니다.', async () => {
      // Given
      const topic = 'topic';
      const message = 'message';
      const outbox = await outboxService.create({ topic, message });

      // When
      const publishedOutbox = await outboxService.toPublished(outbox.id);

      // Then
      expect(publishedOutbox.status).toBe(OutboxStatus.PUBLISHED);
    });
  });

  describe('실패한 아웃박스 조회', () => {
    it('3분 이상 지난 INIT 상태의 아웃박스를 조회합니다.', async () => {
      // Given
      const pastDate = new Date(Date.now() - 5 * 60 * 1000);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.INIT, createdAt: pastDate },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.INIT, createdAt: recentDate },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.PUBLISHED, createdAt: pastDate },
      ]);

      // When
      const failedOutboxes = await outboxService.findFailed();

      // Then
      expect(failedOutboxes).toHaveLength(1);
      expect(failedOutboxes[0].topic).toBe('topic1');
    });
  });

  describe('오래된 발행 아웃박스 삭제', () => {
    it('10일 이상 지난 PUBLISHED 상태의 아웃박스를 삭제합니다.', async () => {
      // Given
      const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentDate = new Date(Date.now() - 1 * 60 * 1000);
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.INIT, createdAt: pastDate },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.INIT, createdAt: recentDate },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.PUBLISHED, createdAt: pastDate },
      ]);

      // When
      await outboxService.removeOldPublishedOutboxes();

      // Then
      const outboxes = await outboxRepository.find();
      expect(outboxes).toHaveLength(2);
    });
  });
});
