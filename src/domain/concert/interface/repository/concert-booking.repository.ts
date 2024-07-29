import { EntityManager } from 'typeorm';
import { ConcertBooking } from '../../model/concert-booking.domain';
import { CustomLock } from 'src/common/interface/database.interface';
import { Nullable } from 'src/common/type/native';

export const ConcertBookingRepositorySymbol = Symbol.for('ConcertBookingRepository');

export interface ConcertBookingRepository {
  findOneById(id: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<ConcertBooking>>;
  save(concertBooking: ConcertBooking, entityManager?: EntityManager): Promise<ConcertBooking>;
  update(concertBooking: ConcertBooking, entityManager?: EntityManager): Promise<boolean>;
}
