import { EntityManager } from 'typeorm';
import { PointHistory } from '../../model/point-history.domain';

export const PointHistoryRepositorySymbol = Symbol.for('PointHistoryRepository');

export interface PointHistoryRepository {
  save(pointHistory: PointHistory, entityManager?: EntityManager): Promise<PointHistory>;
}
