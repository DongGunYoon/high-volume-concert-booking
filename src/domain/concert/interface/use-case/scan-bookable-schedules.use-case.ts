import { ConcertSchedule } from '../../model/concert-schedule.domain';

export const ScanBookableSchedulesUseCaseSymbol = Symbol.for('ScanBookableSchedulesUseCase');

export interface ScanBookableSchedulesUseCase {
  execute(concertId: number): Promise<ConcertSchedule[]>;
}
