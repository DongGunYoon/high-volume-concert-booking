import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';

export class BookingCompletedEvent {
  constructor(
    public readonly booking: ConcertBooking,
    public readonly transactionId: EventTrasactionIdEnum,
  ) {}
}
