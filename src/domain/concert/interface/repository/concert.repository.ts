import { EntityManager } from 'typeorm';
import { Concert } from '../../model/concert.domain';

export const ConcertRepositorySymbol = Symbol.for('ConcertRepository');

export interface ConcertRepository {
  findAll(): Promise<Concert[]>;
  existsById(id: number): Promise<boolean>;
  save(concert: Concert, entityManager?: EntityManager): Promise<Concert>;
}
