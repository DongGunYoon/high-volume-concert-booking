import { Inject, Injectable } from '@nestjs/common';
import { ConcertBookingRepository, ConcertBookingRepositorySymbol } from '../interface/repository/concert-booking.repository';
import { EventBus } from '@nestjs/cqrs';
import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';
import { ConcertBooking } from '../model/concert-booking.domain';
import { EntityManager } from 'typeorm';
import { EventTrasactionIdEnum } from 'src/common/enum/event.enum';
import { BookingCompletedEvent } from 'src/event/booking/booking-completed.event';

@Injectable()
export class BookingService {
  constructor(
    @Inject(ConcertBookingRepositorySymbol) private readonly concertBookingRepository: ConcertBookingRepository,
    private readonly eventBus: EventBus,
  ) {}

  async createBooking(dto: CreateConcertBookingDTO, entityManager: EntityManager): Promise<ConcertBooking> {
    let booking = ConcertBooking.create(dto);
    booking = await this.concertBookingRepository.save(booking, entityManager);

    this.eventBus.publish(new BookingCompletedEvent(booking, EventTrasactionIdEnum.CONCERT_BOOKING_COMPLETED));

    return booking;
  }
}
