import { Point } from 'src/domain/point/model/point.domain';
import * as jwt from 'jsonwebtoken';

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

  issueToken(): string {
    return jwt.sign({ userId: this.id }, process.env.JWT_USER_SECRET || 'test', { expiresIn: '1d' });
  }
}
