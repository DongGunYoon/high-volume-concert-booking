import { ChargePointUseCaseDTO } from 'src/application/point/dto/charge-point.use-case.dto';
import { Point } from '../../model/point.domain';

export const ChargePointUseCaseSymbol = Symbol.for('ChargePointUseCase');

export interface ChargePointUseCase {
  execute(dto: ChargePointUseCaseDTO): Promise<Point>;
}
