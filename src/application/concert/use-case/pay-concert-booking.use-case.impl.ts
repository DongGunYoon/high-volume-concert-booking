import { Injectable } from '@nestjs/common';
import { PayConcertBookingUseCaseDTO } from 'src/application/concert/dto/pay-concert-booking.use-case.dto';
import { PayConcertBookingUseCase } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { PaymentService } from 'src/domain/concert/service/payment.service';
import { PessimisticLockMode } from 'src/common/enum/database.enum';
import { PointService } from 'src/domain/point/service/point.service';
import { DataSource } from 'typeorm';
import { TokenQueueService } from 'src/domain/token/service/token-queue.service';
import { EventBus } from '@nestjs/cqrs';
import { PaymentCompletedEvent } from 'src/event/payment/payment-completed.event';
import { EventTrasactionId } from 'src/common/enum/event.enum';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';

@Injectable()
export class PayConcertBookingUseCaseImpl implements PayConcertBookingUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly paymentService: PaymentService,
    private readonly pointService: PointService,
    private readonly tokenQueueService: TokenQueueService,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: PayConcertBookingUseCaseDTO): Promise<ConcertPayment> {
    const [payment, outbox] = await this.dataSource.transaction(async transactionManager => {
      const booking = await this.concertService.payBooking(dto.toPayBookingDTO(), transactionManager);
      await this.concertService.paySeat(booking.concertSeatId, transactionManager);
      await this.pointService.use(dto.toPayPointDTO(booking.price), transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
      const payment = await this.paymentService.create(
        dto.toCreatePaymentDTO(booking.concertId, booking.concertScheduleId, booking.concertSeatId, booking.price),
        transactionManager,
      );
      const outbox = await this.outboxService.create(dto.toCreateOutboxDTO(payment), transactionManager);
      return [payment, outbox];
    });

    this.eventBus.publish(new PaymentCompletedEvent(outbox, EventTrasactionId.CONCERT_PAYMENT_COMPLETED));
    this.tokenQueueService.expire(dto.userId);

    return payment;
  }
}
