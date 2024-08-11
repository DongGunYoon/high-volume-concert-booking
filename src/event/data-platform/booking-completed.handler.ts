import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCompletedEvent } from '../booking/booking-completed.event';
import { DataPlatformService } from 'src/domain/client/data-platform.service';
import { EventTrasactionId } from 'src/common/enum/event.enum';

@EventsHandler(BookingCompletedEvent)
export class DataPlatformBookingCompletedHandler implements IEventHandler<BookingCompletedEvent> {
  constructor(private readonly dataPlatformService: DataPlatformService) {}

  async handle(event: BookingCompletedEvent) {
    try {
      await this.dataPlatformService.sendBookingResult(event.booking);
    } catch (error) {
      if (event.transactionId === EventTrasactionId.CONCERT_BOOKING_COMPLETED) {
        // 보상 트랜잭션이 존재 시, 작성
      }
    }
  }
}
