export const ConcertRepositorySymbol = Symbol.for('ConcertRepository');

export interface ConcertRepository {
  existsById(id: number): Promise<boolean>;
}
