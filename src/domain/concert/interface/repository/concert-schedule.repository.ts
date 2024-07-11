import { Nullable } from 'src/common/type/native';
import { ConcertSchedule } from '../../model/concert-schedule.domain';

export const ConcertScheduleRepositorySymbol = Symbol.for('ConcertScheduleRepository');

export interface ConcertScheduleRepository {
  existsById(id: number): Promise<boolean>;
  findOneById(id: number): Promise<Nullable<ConcertSchedule>>;
  findAllBookableByConcertId(concertId: number): Promise<ConcertSchedule[]>;
}
