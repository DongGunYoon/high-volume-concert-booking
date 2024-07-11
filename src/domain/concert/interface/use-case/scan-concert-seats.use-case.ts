import { ConcertSeat } from '../../model/concert-seat.domain';

export const ScanConcertSeatsUseCaseSymbol = Symbol.for('ScanConcertSeatsUseCase');

export interface ScanConcertSeatsUseCase {
  execute(concertScheduleId: number): Promise<ConcertSeat[]>;
}
