import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Nullable } from 'src/common/type/native';
import { ScanBookableSchedulesUseCase } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';

@Injectable()
export class ScanBookableSchedulesUseCaseImpl implements ScanBookableSchedulesUseCase {
  constructor(
    private readonly concertService: ConcertService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(concertId: number): Promise<ConcertSchedule[]> {
    let bookableSchedules = (await this.cacheManager.get(this.getCacheKey(concertId))) as Nullable<ConcertSchedule[]>;

    if (!bookableSchedules) {
      bookableSchedules = await this.concertService.scanBookableSchedueles(concertId);
      await this.cacheManager.set(this.getCacheKey(concertId), bookableSchedules);
    }

    return bookableSchedules;
  }

  private getCacheKey(concertId: number): string {
    return `concerts:${concertId}:bookable_schedules`;
  }
}
