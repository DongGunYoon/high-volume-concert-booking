import { Inject, Injectable } from '@nestjs/common';
import { ConcertBookingRepository, ConcertBookingRepositorySymbol } from '../interface/repository/concert-booking.repository';
import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';
import { ConcertBooking } from '../model/concert-booking.domain';
import { EntityManager } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(@Inject(ConcertBookingRepositorySymbol) private readonly concertBookingRepository: ConcertBookingRepository) {}

  async createBooking(dto: CreateConcertBookingDTO, entityManager: EntityManager): Promise<ConcertBooking> {
    const booking = ConcertBooking.create(dto);

    return await this.concertBookingRepository.save(booking, entityManager);
  }
}
