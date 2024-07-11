import { Injectable } from '@nestjs/common';
import { BookConcertSeatUseCaseDTO } from 'src/application/concert/dto/book-concert-seat.use-case.dto';
import { BookConcertSeatUseCase } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { PessimisticLockMode } from 'src/domain/database/enum/lock-mode.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class BookConcertSeatUseCaseImpl implements BookConcertSeatUseCase {
  constructor(
    private readonly concertService: ConcertService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: BookConcertSeatUseCaseDTO): Promise<ConcertBooking> {
    await this.concertService.validateScheduleIsBookable(dto.concertScheduleId);

    return await this.dataSource.transaction(async transactionManager => {
      const bookedSeat = await this.concertService.bookSeat(dto.concertSeatId, transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
      return await this.concertService.createBooking(dto.toCreateConcertBookingDTO(bookedSeat.concertId, bookedSeat.price), transactionManager);
    });
  }
}
