import { Concert } from '../../model/concert.domain';

export const ConcertRepositorySymbol = Symbol.for('ConcertRepository');

export interface ConcertRepository {
  findAll(): Promise<Concert[]>;
  existsById(id: number): Promise<boolean>;
}
