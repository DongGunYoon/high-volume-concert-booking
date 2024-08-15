import { EntityManager } from 'typeorm';
import { Processed } from '../model/processed.domain';

export const ProcessedRepositorySymbol = Symbol.for('ProcessedRepository');

export interface ProcessedRepository {
  save(processed: Processed, entityManager?: EntityManager): Promise<Processed>;
}
