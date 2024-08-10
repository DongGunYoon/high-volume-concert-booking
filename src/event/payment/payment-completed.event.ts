import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';

export class PaymentCompletedEvent {
  constructor(
    public readonly payment: ConcertPayment,
    public readonly transactionId: EventTrasactionIdEnum,
  ) {}
}
