import { Point } from 'src/domain/point/model/point.domain';

export class User {
  constructor(
    public id: number,
    public name: string,
    public point?: Point,
  ) {}

  static create(name: string): User {
    const point = Point.create();

    return new User(0, name, point);
  }
}
