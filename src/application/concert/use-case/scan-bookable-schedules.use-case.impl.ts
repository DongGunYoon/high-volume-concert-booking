import { Injectable } from '@nestjs/common';
import { ScanBookableSchedulesUseCase } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';

@Injectable()
export class ScanBookableSchedulesUseCaseImpl implements ScanBookableSchedulesUseCase {
  constructor(private readonly concertService: ConcertService) {}

  async execute(concertId: number): Promise<ConcertSchedule[]> {
    return await this.concertService.scanBookableSchedueles(concertId);
  }
}
