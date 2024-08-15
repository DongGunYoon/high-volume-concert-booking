import { EventTrasactionId } from 'src/common/enum/event.enum';
import { Outbox } from 'src/domain/outbox/model/outbox.domain';

export class PaymentCompletedEvent {
  constructor(
    public readonly outbox: Outbox,
    public readonly transactionId: EventTrasactionId,
  ) {}
}
