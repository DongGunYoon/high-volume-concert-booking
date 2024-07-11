import { Point } from '../../model/point.domain';

export const ReadPointUseCaseSymbol = Symbol.for('ReadPointUseCase');

export interface ReadPointUseCase {
  execute(userId: number): Promise<Point>;
}
