import { Injectable } from '@nestjs/common';
import { ScanConcertsUseCase } from 'src/domain/concert/interface/use-case/scan-concerts.use-case';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';

@Injectable()
export class ScanConcertsUseCaseImpl implements ScanConcertsUseCase {
  constructor(private readonly concertService: ConcertService) {}

  async execute(): Promise<Concert[]> {
    return await this.concertService.scanConcerts();
  }
}
