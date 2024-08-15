import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { OutboxModule } from 'src/module/outbox.module';
import { Repository } from 'typeorm';
import { OutboxEntity } from 'src/infrastructure/outbox/outbox.entity';
import { OutboxStatus } from 'src/domain/outbox/enum/outbox.enum';
import { HandleFailedOutboxesUseCase } from 'src/application/outbox/handle-failed-outboxes.use-case';
import { OutboxKafkaMessageSender } from 'src/infrastructure/kafka/outbox/outbox.kafka-message-sender';

describe('HandleFailedOutboxesUseCase', () => {
  let module: TestingModule;
  let handleFailedOutboxesUseCase: HandleFailedOutboxesUseCase;
  let outboxKafkaMessageSender: OutboxKafkaMessageSender;
  let outboxRepository: Repository<OutboxEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), OutboxModule],
    })
      .overrideProvider(OutboxKafkaMessageSender)
      .useValue({ sendMessage: jest.fn() })
      .compile();

    handleFailedOutboxesUseCase = module.get(HandleFailedOutboxesUseCase);
    outboxKafkaMessageSender = module.get(OutboxKafkaMessageSender);
    outboxRepository = module.get(getRepositoryToken(OutboxEntity));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    outboxRepository.clear();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('미처리 아웃박스 테스트', () => {
    it('모든 아웃박스가 PUBLISHED 상태라면, 카프카 메시지 발송이 이루어지지 않습니다.', async () => {
      // Given
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.PUBLISHED, createdAt: new Date() },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.PUBLISHED, createdAt: new Date() },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.PUBLISHED, createdAt: new Date() },
      ]);

      // When
      await handleFailedOutboxesUseCase.execute();

      // Then
      expect(outboxKafkaMessageSender.sendMessage).not.toHaveBeenCalled();
      expect(outboxKafkaMessageSender.sendMessage).toHaveBeenCalledTimes(0);
    });

    it('3분 이상 지난 INIT 상태의 아웃박스가 있다면, 해당하는 개수만큼 카프카 메시지 발송이 이루어집니다.', async () => {
      // Given
      const pastDate = new Date(Date.now() - 5 * 60 * 1000);
      await outboxRepository.save([
        { topic: 'topic1', message: 'message1', status: OutboxStatus.INIT, createdAt: pastDate },
        { topic: 'topic2', message: 'message2', status: OutboxStatus.INIT, createdAt: pastDate },
        { topic: 'topic3', message: 'message3', status: OutboxStatus.PUBLISHED, createdAt: pastDate },
      ]);

      // When
      await handleFailedOutboxesUseCase.execute();

      // Then
      expect(outboxKafkaMessageSender.sendMessage).toHaveBeenCalled();
      expect(outboxKafkaMessageSender.sendMessage).toHaveBeenCalledTimes(2);
    });
  });
});
