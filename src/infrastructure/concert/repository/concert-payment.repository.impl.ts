import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertPaymentRepository } from 'src/domain/concert/interface/repository/concert-payment.repository';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { EntityManager, Repository } from 'typeorm';
import { ConcertPaymentEntity } from '../entity/concert-payment.entity';
import { ConcertPaymentMapper } from '../mapper/concert-payment.mapper';

@Injectable()
export class ConcertPaymentRepositoryImpl implements ConcertPaymentRepository {
  constructor(@InjectRepository(ConcertPaymentEntity) private readonly concertPaymentRepository: Repository<ConcertPaymentEntity>) {}

  async save(concertPayment: ConcertPayment, entityManager?: EntityManager): Promise<ConcertPayment> {
    const entity = ConcertPaymentMapper.toEntity(concertPayment);

    if (entityManager) await entityManager.save(entity);
    else await this.concertPaymentRepository.save(entity);

    return ConcertPaymentMapper.toDomain(entity);
  }
}
