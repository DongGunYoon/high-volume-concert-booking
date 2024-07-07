import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PointModule } from './presentation/point/point.module';

@Module({
  imports: [DatabaseModule, PointModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
