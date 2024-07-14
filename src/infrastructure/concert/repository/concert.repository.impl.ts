import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertRepository } from 'src/domain/concert/interface/repository/concert.repository';
import { ConcertEntity } from '../entity/concert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(@InjectRepository(ConcertEntity) private readonly concertRepository: Repository<ConcertEntity>) {}

  async existsById(id: number): Promise<boolean> {
    return await this.concertRepository.existsBy({ id });
  }
}
