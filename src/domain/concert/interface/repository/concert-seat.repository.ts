import { EntityManager } from 'typeorm';
import { ConcertSeat } from '../../model/concert-seat.domain';
import { CustomLock } from 'src/domain/database/interface/lock.interface';
import { Nullable } from 'src/common/type/native';

export const ConcertSeatRepositorySymbol = Symbol.for('ConcertSeatRepository');

export interface ConcertSeatRepository {
  findOneById(id: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<ConcertSeat>>;
  findAllByConcertScheduleId(concertScheduleId: number): Promise<ConcertSeat[]>;
  save(concertSeat: ConcertSeat, entityManager?: EntityManager): Promise<ConcertSeat>;
}
