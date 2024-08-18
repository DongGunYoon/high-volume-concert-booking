import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HandleFailedOutboxesUseCase } from 'src/application/outbox/handle-failed-outboxes.use-case';
import { RemoveOldPublishedOutboxesUseCase } from 'src/application/outbox/remove-old-published-outboxes.use-case';
import { OutboxRepositorySymbol } from 'src/domain/outbox/interface/outbox.repository';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';
import { OutboxBookingConsumer } from 'src/event/outbox/outbox.booking-consumer';
import { OutboxPaymentConsumer } from 'src/event/outbox/outbox.payment-consumer';
import { OutboxKafkaMessageSender } from 'src/infrastructure/kafka/outbox/outbox.kafka-message-sender';
import { OutboxEntity } from 'src/infrastructure/outbox/outbox.entity';
import { OutboxRepositoryImpl } from 'src/infrastructure/outbox/outbox.repository.impl';
import { OutboxScheduler } from 'src/interface/scheduler/outbox.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEntity]),
    ClientsModule.register([
      {
        name: 'OUTBOX_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  providers: [
    OutboxScheduler,
    HandleFailedOutboxesUseCase,
    RemoveOldPublishedOutboxesUseCase,
    OutboxService,
    OutboxKafkaMessageSender,
    OutboxBookingConsumer,
    OutboxPaymentConsumer,
    { provide: OutboxRepositorySymbol, useClass: OutboxRepositoryImpl },
  ],
  exports: [OutboxService],
})
export class OutboxModule {}
