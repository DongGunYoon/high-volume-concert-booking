import { BadRequestException } from '@nestjs/common';
import { User } from 'src/domain/user/model/user.domain';

export class Point {
  constructor(
    public id: number,
    public userId: number,
    public amount: number,
    public user?: User,
  ) {}

  static create(): Point {
    return new Point(0, 0, 0);
  }

  charge(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('충전 금액은 최소 0원 이상이어야 합니다.');
    }

    this.amount += amount;
  }

  pay(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('결제 금액은 최소 0원 이상이어야 합니다.');
    }

    if (this.amount < amount) {
      throw new BadRequestException('결제에 필요한 금액이 모자릅니다.');
    }

    this.amount -= amount;
  }
}
