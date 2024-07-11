import { IsInt } from 'class-validator';
import { ChargePointUseCaseDTO } from 'src/application/point/dto/charge-point.use-case.dto';

export class ChargePointRequest {
  constructor(amount: number) {
    this.amount = amount;
  }

  @IsInt()
  amount: number;

  toUseCaseDTO(userId: number): ChargePointUseCaseDTO {
    return new ChargePointUseCaseDTO(userId, this.amount);
  }
}
