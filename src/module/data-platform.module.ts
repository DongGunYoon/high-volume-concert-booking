import { Module } from '@nestjs/common';
import { DataPlatformClientSymbol } from 'src/domain/client/data-platform.client';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { DataPlatformBookingConsumer } from 'src/event/data-platform/data-platform.booking-consumer';
import { DataPlatformPaymentConsumer } from 'src/event/data-platform/data-platform.payment-consumer';
import { DataPlatformClientImpl } from 'src/infrastructure/client/data-platform.client.impl';
import { ProcessedModule } from './processed.module';

@Module({
  imports: [ProcessedModule],
  providers: [
    DataPlatformBookingConsumer,
    DataPlatformPaymentConsumer,
    DataPlatformService,
    { provide: DataPlatformClientSymbol, useClass: DataPlatformClientImpl },
  ],
  exports: [DataPlatformClientSymbol, DataPlatformService],
})
export class DataPlatformModule {}
