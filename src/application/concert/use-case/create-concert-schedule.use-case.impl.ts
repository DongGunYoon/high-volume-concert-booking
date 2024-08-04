import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { CreateConcertScheduleUseCaseDTO } from '../dto/create-concert-schedule.use-case.dto';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';

@Injectable()
export class CreateConcertScheduleUseCase {
  constructor(
    private readonly concertService: ConcertService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(dto: CreateConcertScheduleUseCaseDTO): Promise<ConcertSchedule> {
    const schedule = await this.concertService.createSchedule(dto.toCreateConcertScheduleDTO());

    await this.cacheManager.del(this.getEvictionCacheKey(dto.concertId));

    return schedule;
  }

  private getEvictionCacheKey(concertId: number): string {
    return `concerts:${concertId}:bookable_schedules`;
  }
}
