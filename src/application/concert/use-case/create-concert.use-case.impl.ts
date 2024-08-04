import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConcertService } from 'src/domain/concert/service/concert.service';
import { CreateConcertUseCaseDTO } from '../dto/create-concert-use-case.dto';
import { Concert } from 'src/domain/concert/model/concert.domain';

@Injectable()
export class CreateConcertUseCase {
  constructor(
    private readonly concertService: ConcertService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(dto: CreateConcertUseCaseDTO): Promise<Concert> {
    const concert = await this.concertService.create(dto.toCreateConcertDTO());

    await this.cacheManager.del(this.getEvictionCacheKey());

    return concert;
  }

  private getEvictionCacheKey(): string {
    return 'concerts';
  }
}
