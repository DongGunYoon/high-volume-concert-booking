import { ErrorCode } from 'src/common/enum/error-code.enum';
import { CustomException } from 'src/common/exception/custom.exception';
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
      throw new CustomException(ErrorCode.MINIMUM_CHARGE_AMOUNT);
    }

    this.amount += amount;
  }

  pay(amount: number): void {
    if (amount <= 0) {
      throw new CustomException(ErrorCode.MINIMUM_PAYMENT_AMOUNT);
    }

    if (this.amount < amount) {
      throw new CustomException(ErrorCode.INSUFFICIENT_POINT);
    }

    this.amount -= amount;
  }
}
