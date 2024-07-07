import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PointModule } from './presentation/point/point.module';
import { ConcertModule } from './presentation/concert/concert.module';

@Module({
  imports: [DatabaseModule, ConcertModule, PointModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
