import { Module } from '@nestjs/common';
import { ConcertController } from './controller/concert.controller';

@Module({
  controllers: [ConcertController],
})
export class ConcertModule {}
