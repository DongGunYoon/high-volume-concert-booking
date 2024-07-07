import { IsInt } from 'class-validator';

export class ChargePointRequest {
  constructor(amount: number) {
    this.amount = amount;
  }

  @IsInt()
  amount: number;
}
