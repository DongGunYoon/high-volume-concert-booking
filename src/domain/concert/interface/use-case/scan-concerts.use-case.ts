import { Concert } from '../../model/concert.domain';

export const ScanConcertsUseCaseSymbol = Symbol.for('ScanConcertsUseCase');

export interface ScanConcertsUseCase {
  execute(): Promise<Concert[]>;
}
