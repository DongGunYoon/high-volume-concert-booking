import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConcertModule } from './concert.module';
import { PointModule } from './point.module';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from 'src/config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ConcertModule,
    PointModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
