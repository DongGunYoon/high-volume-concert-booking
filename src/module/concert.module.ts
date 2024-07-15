import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertPaymentEntity } from 'src/infrastructure/concert/entity/concert-payment.entity';
import { ConcertBookingEntity } from 'src/infrastructure/concert/entity/concert-booking.entity';
import { ScanBookableSchedulesUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ScanBookableSchedulesUseCaseImpl } from 'src/application/concert/use-case/scan-bookable-schedules.use-case.impl';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { ConcertScheduleRepositorySymbol } from 'src/domain/concert/interface/repository/concert-schedule.repository';
import { ConcertScheduleRepositoryImpl } from 'src/infrastructure/concert/repository/concert-schedule.repository.impl';
import { ConcertRepositorySymbol } from 'src/domain/concert/interface/repository/concert.repository';
import { ConcertRepositoryImpl } from 'src/infrastructure/concert/repository/concert.repository.impl';
import { ScanConcertSeatsUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-concert-seats.use-case';
import { ScanConcertSeatsUseCaseImpl } from 'src/application/concert/use-case/scan-concert-seats.use-case.impl';
import { ConcertSeatRepositorySymbol } from 'src/domain/concert/interface/repository/concert-seat.repository';
import { ConcertSeatRepositoryImpl } from 'src/infrastructure/concert/repository/concert-seat.repository.impl';
import { BookConcertSeatUseCaseSymbol } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { BookConcertSeatUseCaseImpl } from 'src/application/concert/use-case/book-concert-seat.use-case.impl';
import { ConcertBookingRepositorySymbol } from 'src/domain/concert/interface/repository/concert-booking.repository';
import { ConcertBookingRepositoryImpl } from 'src/infrastructure/concert/repository/concert-booking.repository.impl';
import { PayConcertBookingUseCaseSymbol } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { PayConcertBookingUseCaseImpl } from 'src/application/concert/use-case/pay-concert-booking.use-case.impl';
import { PaymentService } from 'src/domain/concert/service/payment.service';
import { ConcertPaymentRepositorySymbol } from 'src/domain/concert/interface/repository/concert-payment.repository';
import { ConcertPaymentRepositoryImpl } from 'src/infrastructure/concert/repository/concert-payment.repository.impl';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { PointModule } from './point.module';
import { ConcertController } from 'src/interface/presentation/concert/controller/concert.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcertEntity, ConcertScheduleEntity, ConcertSeatEntity, ConcertBookingEntity, ConcertPaymentEntity]),
    AuthModule,
    UserModule,
    PointModule,
  ],
  controllers: [ConcertController],
  providers: [
    ConcertService,
    PaymentService,
    { provide: ScanBookableSchedulesUseCaseSymbol, useClass: ScanBookableSchedulesUseCaseImpl },
    { provide: ScanConcertSeatsUseCaseSymbol, useClass: ScanConcertSeatsUseCaseImpl },
    { provide: BookConcertSeatUseCaseSymbol, useClass: BookConcertSeatUseCaseImpl },
    { provide: PayConcertBookingUseCaseSymbol, useClass: PayConcertBookingUseCaseImpl },
    { provide: ConcertRepositorySymbol, useClass: ConcertRepositoryImpl },
    { provide: ConcertScheduleRepositorySymbol, useClass: ConcertScheduleRepositoryImpl },
    { provide: ConcertSeatRepositorySymbol, useClass: ConcertSeatRepositoryImpl },
    { provide: ConcertBookingRepositorySymbol, useClass: ConcertBookingRepositoryImpl },
    { provide: ConcertPaymentRepositorySymbol, useClass: ConcertPaymentRepositoryImpl },
  ],
})
export class ConcertModule {}
