import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertRepository } from 'src/domain/concert/interface/repository/concert.repository';
import { ConcertEntity } from '../entity/concert.entity';
import { Repository } from 'typeorm';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertMapper } from '../mapper/concert.mapper';

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepository {
  constructor(@InjectRepository(ConcertEntity) private readonly concertRepository: Repository<ConcertEntity>) {}

  async findAll(): Promise<Concert[]> {
    const entities = await this.concertRepository.find();

    return entities.map(entity => ConcertMapper.toDomain(entity));
  }

  async existsById(id: number): Promise<boolean> {
    return await this.concertRepository.existsBy({ id });
  }
}
