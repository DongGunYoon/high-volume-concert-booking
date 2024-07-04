import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConcertModule } from './presentation/concert/concert.module';

@Module({
  imports: [DatabaseModule, ConcertModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
