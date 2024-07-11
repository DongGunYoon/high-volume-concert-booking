import { EntityManager } from 'typeorm';
import { ConcertPayment } from '../../model/concert-payment.domain';

export const ConcertPaymentRepositorySymbol = Symbol.for('ConcertPaymentRepository');

export interface ConcertPaymentRepository {
  save(concertPayment: ConcertPayment, entityManager?: EntityManager): Promise<ConcertPayment>;
}
