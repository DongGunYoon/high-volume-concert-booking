import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PointModule } from './presentation/point/point.module';
import { ConcertModule } from './presentation/concert/concert.module';
import { UserModule } from './presentation/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, ConcertModule, PointModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
