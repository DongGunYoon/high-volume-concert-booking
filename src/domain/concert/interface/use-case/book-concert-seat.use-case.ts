import { BookConcertSeatUseCaseDTO } from 'src/application/concert/dto/book-concert-seat.use-case.dto';
import { ConcertBooking } from '../../model/concert-booking.domain';

export const BookConcertSeatUseCaseSymbol = Symbol.for('BookConcertSeatUseCase');

export interface BookConcertSeatUseCase {
  execute(dto: BookConcertSeatUseCaseDTO): Promise<ConcertBooking>;
}
