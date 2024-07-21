import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConcertModule } from './concert.module';
import { PointModule } from './point.module';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from 'src/config/typeorm.config';
import { LoggerModule } from './logger.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filter/api-exception.filter';
import { ApiResponseInterceptor } from 'src/common/interceptor/api.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ConcertModule,
    PointModule,
    UserModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
