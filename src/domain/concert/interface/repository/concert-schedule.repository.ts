import { Nullable } from 'src/common/type/native';
import { ConcertSchedule } from '../../model/concert-schedule.domain';
import { EntityManager } from 'typeorm';

export const ConcertScheduleRepositorySymbol = Symbol.for('ConcertScheduleRepository');

export interface ConcertScheduleRepository {
  existsById(id: number): Promise<boolean>;
  findOneById(id: number): Promise<Nullable<ConcertSchedule>>;
  findAllBookableByConcertId(concertId: number): Promise<ConcertSchedule[]>;
  save(concertSchedule: ConcertSchedule, entityManager?: EntityManager): Promise<ConcertSchedule>;
}
