import { Nullable } from 'src/common/type/native';
import { EntityManager } from 'typeorm';
import { Point } from '../../model/point.domain';
import { CustomLock } from 'src/common/interface/database.interface';

export const PointRepositorySymbol = Symbol.for('PointRepository');

export interface PointRepository {
  findOneByUserId(userId: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<Point>>;
  save(point: Point, entityManager?: EntityManager): Promise<Point>;
}
