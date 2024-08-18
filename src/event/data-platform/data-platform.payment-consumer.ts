import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';
import { ProcessedService } from 'src/domain/processed/service/processed.service';

@Injectable()
export class DataPlatformPaymentConsumer {
  constructor(
    private readonly dataPlatformService: DataPlatformService,
    private readonly processedService: ProcessedService,
  ) {}

  @EventPattern('payment.completed')
  async sendPaymentData(@Payload() data: { value: Outbox }) {
    const payment = JSON.parse(data.value.message) as ConcertPayment;
    const processed = await this.processedService.create({ outboxId: data.value.id });

    try {
      await this.dataPlatformService.sendPaymentResult(payment);
    } catch (error) {
      // 보상 트랜잭션이 존재 시, 작성
    }

    await this.processedService.toSuccess(processed);
  }
}
