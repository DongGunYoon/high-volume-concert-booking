import { Injectable } from '@nestjs/common';
import { PayConcertBookingUseCaseDTO } from 'src/application/concert/dto/pay-concert-booking.use-case.dto';
import { PayConcertBookingUseCase } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { PaymentService } from 'src/domain/concert/service/payment.service';
import { PessimisticLockMode } from 'src/common/enum/database.enum';
import { PointService } from 'src/domain/point/service/point.service';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';
import { DataSource } from 'typeorm';

@Injectable()
export class PayConcertBookingUseCaseImpl implements PayConcertBookingUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly paymentService: PaymentService,
    private readonly pointService: PointService,
    private readonly userQueueService: UserQueueService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: PayConcertBookingUseCaseDTO): Promise<ConcertPayment> {
    const payment = await this.dataSource.transaction(async transactionManager => {
      const booking = await this.concertService.payBooking(dto.toPayBookingDTO(), transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
      await this.concertService.paySeat(booking.concertSeatId, transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
      await this.pointService.pay(dto.toPayPointDTO(booking.price), transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
      return await this.paymentService.create(dto.toCreatePaymentDTO(booking.concertId, booking.concertScheduleId, booking.concertSeatId, booking.price));
    });

    this.userQueueService.expire(dto.userQueueId);

    return payment;
  }
}
