import { Module } from '@nestjs/common';
import { PointController } from './controller/point.controller';

@Module({
  controllers: [PointController],
})
export class PointModule {}
