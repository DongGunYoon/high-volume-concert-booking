import { Inject, Injectable } from '@nestjs/common';
import { ConcertPaymentRepository, ConcertPaymentRepositorySymbol } from '../interface/repository/concert-payment.repository';
import { ConcertPayment } from '../model/concert-payment.domain';
import { CreatePaymentDTO } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(@Inject(ConcertPaymentRepositorySymbol) private readonly concertPaymentRepository: ConcertPaymentRepository) {}

  async create(dto: CreatePaymentDTO): Promise<ConcertPayment> {
    const payment = ConcertPayment.create(dto);

    return await this.concertPaymentRepository.save(payment);
  }
}
