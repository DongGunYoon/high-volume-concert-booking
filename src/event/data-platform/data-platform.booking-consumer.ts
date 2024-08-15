import { ProcessedService } from './../../domain/processed/service/processed.service';
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

@Injectable()
export class DataPlatformBookingConsumer {
  constructor(
    private readonly dataPlatformService: DataPlatformService,
    private readonly processedService: ProcessedService,
  ) {}

  @EventPattern('booking.completed')
  async sendBookingData(@Payload() data: { value: Outbox }) {
    const booking = JSON.parse(data.value.message) as ConcertBooking;
    const processed = await this.processedService.create({ outboxId: data.value.id });

    try {
      await this.dataPlatformService.sendBookingResult(booking);
    } catch (error) {
      // 보상 트랜잭션이 존재 시, 작성
    }

    await this.processedService.toSuccess(processed);
  }
}
