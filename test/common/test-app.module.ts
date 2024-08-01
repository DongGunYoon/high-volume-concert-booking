import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTypeORMConfig } from 'test/common/test-typeorm.config';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { PointModule } from 'src/module/point.module';
import { UserModule } from 'src/module/user.module';
import { TestDataService } from './test-data.service';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserQueueEntity } from 'src/infrastructure/user/entity/user-queue.entity';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';
import { PointHistoryEntity } from 'src/infrastructure/point/entity/point-history.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertBookingEntity } from 'src/infrastructure/concert/entity/concert-booking.entity';
import { ConcertPaymentEntity } from 'src/infrastructure/concert/entity/concert-payment.entity';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filter/api-exception.filter';
import { ApiResponseInterceptor } from 'src/common/interceptor/api.interceptor';
import { LoggerModule } from 'src/module/logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TestCacheConfig } from './test-cache.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(TestTypeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(TestCacheConfig),
    TypeOrmModule.forFeature([
      UserEntity,
      UserQueueEntity,
      PointEntity,
      PointHistoryEntity,
      ConcertEntity,
      ConcertScheduleEntity,
      ConcertSeatEntity,
      ConcertBookingEntity,
      ConcertPaymentEntity,
    ]),
    ScheduleModule.forRoot(),
    ConcertModule,
    PointModule,
    UserModule,
    AuthModule,
    LoggerModule,
  ],
  providers: [
    TestDataService,
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
  exports: [TestDataService],
})
export class TestAppModule {}
