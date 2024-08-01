import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Nullable } from 'src/common/type/native';
import { ScanConcertsUseCase } from 'src/domain/concert/interface/use-case/scan-concerts.use-case';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertService } from 'src/domain/concert/service/concert.service';

@Injectable()
export class ScanConcertsUseCaseImpl implements ScanConcertsUseCase {
  constructor(
    private readonly concertService: ConcertService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(): Promise<Concert[]> {
    let concerts = (await this.cacheManager.get(this.getCacheKey())) as Nullable<Concert[]>;

    if (!concerts) {
      concerts = await this.concertService.scanConcerts();
      await this.cacheManager.set(this.getCacheKey(), concerts);
    }

    return concerts;
  }

  private getCacheKey(): string {
    return 'concerts';
  }
}
