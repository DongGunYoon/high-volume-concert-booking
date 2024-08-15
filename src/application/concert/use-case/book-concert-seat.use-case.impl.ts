import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { BookConcertSeatUseCaseDTO } from 'src/application/concert/dto/book-concert-seat.use-case.dto';
import { EventTrasactionId } from 'src/common/enum/event.enum';
import { BookConcertSeatUseCase } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { BookingService } from 'src/domain/concert/service/booking.service';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { OutboxService } from 'src/domain/outbox/service/outbox.service';
import { BookingCompletedEvent } from 'src/event/booking/booking-completed.event';
import { DataSource } from 'typeorm';

@Injectable()
export class BookConcertSeatUseCaseImpl implements BookConcertSeatUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly bookingService: BookingService,
    private readonly outboxService: OutboxService,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: BookConcertSeatUseCaseDTO): Promise<ConcertBooking> {
    await this.concertService.validateScheduleIsBookable(dto.concertScheduleId);

    const [booking, outbox] = await this.dataSource.transaction(async transactionManager => {
      const bookedSeat = await this.concertService.bookSeat(dto.concertSeatId, transactionManager);
      const booking = await this.bookingService.createBooking(dto.toCreateConcertBookingDTO(bookedSeat.concertId, bookedSeat.price), transactionManager);
      const outbox = await this.outboxService.create(dto.toCreateOutboxDTO(booking), transactionManager);
      return [booking, outbox];
    });

    this.eventBus.publish(new BookingCompletedEvent(outbox, EventTrasactionId.CONCERT_BOOKING_COMPLETED));

    return booking;
  }
}
