import { Injectable } from '@nestjs/common';
import { ScanConcertSeatsUseCase } from 'src/domain/concert/interface/use-case/scan-concert-seats.use-case';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';

@Injectable()
export class ScanConcertSeatsUseCaseImpl implements ScanConcertSeatsUseCase {
  constructor(private readonly concertService: ConcertService) {}

  async execute(concertScheduleId: number): Promise<ConcertSeat[]> {
    return await this.concertService.scanSeats(concertScheduleId);
  }
}
