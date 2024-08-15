import { EntityManager } from 'typeorm';
import { Outbox } from '../model/outbox.domain';
import { Nullable } from 'src/common/type/native';

export const OutboxRepositorySymbol = Symbol.for('OutboxRepository');

export interface OutboxRepository {
  save(outbox: Outbox, entityManager?: EntityManager): Promise<Outbox>;
  findOneById(id: number): Promise<Nullable<Outbox>>;
  findInitCreatedBefore(date: Date): Promise<Outbox[]>;
  removePublishedCreatedBefore(date: Date): Promise<void>;
}
