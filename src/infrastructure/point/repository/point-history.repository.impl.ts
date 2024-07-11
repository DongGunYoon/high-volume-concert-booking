import { PointHistoryRepository } from 'src/domain/point/interface/repository/point-history.repository';
import { PointHistory } from 'src/domain/point/model/point-history.domain';
import { EntityManager, Repository } from 'typeorm';
import { PointHistoryMapper } from '../mapper/point-history.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { PointHistoryEntity } from '../entity/point-history.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointHistoryRepositoryImpl implements PointHistoryRepository {
  constructor(@InjectRepository(PointHistoryEntity) private readonly pointHistoryRepository: Repository<PointHistoryEntity>) {}

  async save(pointHistory: PointHistory, entityManager?: EntityManager): Promise<PointHistory> {
    const entity = PointHistoryMapper.toEntity(pointHistory);

    if (entityManager) await entityManager.save(entity);
    else await this.pointHistoryRepository.save(entity);

    return PointHistoryMapper.toDomain(entity);
  }
}
