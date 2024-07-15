import { Point } from 'src/domain/point/model/point.domain';

export class PointResponse {
  constructor(
    public id: number,
    public userId: number,
    public amount: number,
  ) {}

  static from(point: Point): PointResponse {
    return new PointResponse(point.id, point.userId, point.amount);
  }
}
