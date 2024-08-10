import { Module } from '@nestjs/common';
import { DataPlatformClientSymbol } from 'src/domain/client/data-platform.client';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { DataPlatformClientImpl } from 'src/infrastructure/client/data-platform.client.impl';

@Module({
  providers: [DataPlatformService, { provide: DataPlatformClientSymbol, useClass: DataPlatformClientImpl }],
  exports: [DataPlatformClientSymbol],
})
export class ClientModule {}
