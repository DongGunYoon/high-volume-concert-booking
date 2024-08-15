import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxRepository } from 'src/domain/outbox/interface/outbox.repository';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';
import { EntityManager, LessThan, Repository } from 'typeorm';
import { OutboxEntity } from './outbox.entity';
import { OutboxMapper } from './outbox.mapper';
import { Nullable } from 'src/common/type/native';
import { OutboxStatus } from 'src/domain/outbox/enum/outbox.enum';

@Injectable()
export class OutboxRepositoryImpl implements OutboxRepository {
  constructor(@InjectRepository(OutboxEntity) private readonly outboxRepository: Repository<OutboxEntity>) {}

  async save(outbox: Outbox, entityManager?: EntityManager): Promise<Outbox> {
    const entity = OutboxMapper.toEntity(outbox);

    if (entityManager) await entityManager.save(entity);
    else await this.outboxRepository.save(entity);

    return OutboxMapper.toDomain(entity);
  }

  async findOneById(id: number): Promise<Nullable<Outbox>> {
    const entity = await this.outboxRepository.findOneBy({ id });

    return entity && OutboxMapper.toDomain(entity);
  }

  async findInitCreatedBefore(date: Date): Promise<Outbox[]> {
    const entities = await this.outboxRepository.findBy({ status: OutboxStatus.INIT, createdAt: LessThan(date) });

    return entities.map(entity => OutboxMapper.toDomain(entity));
  }

  async removePublishedCreatedBefore(date: Date): Promise<void> {
    await this.outboxRepository.delete({ status: OutboxStatus.PUBLISHED, createdAt: LessThan(date) });
  }
}
