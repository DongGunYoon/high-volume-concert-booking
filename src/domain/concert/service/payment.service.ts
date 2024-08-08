import { Inject, Injectable } from '@nestjs/common';
import { ConcertPaymentRepository, ConcertPaymentRepositorySymbol } from '../interface/repository/concert-payment.repository';
import { ConcertPayment } from '../model/concert-payment.domain';
import { CreatePaymentDTO } from '../dto/create-payment.dto';
import { EntityManager } from 'typeorm';
import { EventBus } from '@nestjs/cqrs';
import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';
import { PaymentCompletedEvent } from 'src/event/payment/payment-completed.event';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(ConcertPaymentRepositorySymbol) private readonly concertPaymentRepository: ConcertPaymentRepository,
    private readonly eventBus: EventBus,
  ) {}

  async create(dto: CreatePaymentDTO, entityManager: EntityManager): Promise<ConcertPayment> {
    let payment = ConcertPayment.create(dto);
    payment = await this.concertPaymentRepository.save(payment, entityManager);

    this.eventBus.publish(new PaymentCompletedEvent(payment, EventTrasactionIdEnum.CONCERT_PAYMENT_COMPLETED));

    return payment;
  }
}
