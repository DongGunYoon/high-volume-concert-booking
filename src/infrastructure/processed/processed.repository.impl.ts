import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessedRepository } from 'src/domain/processed/interface/processed.repository';
import { Processed } from 'src/domain/processed/model/processed.domain';
import { EntityManager, Repository } from 'typeorm';
import { ProcessedEntity } from './processed.entity';
import { ProcessedMapper } from './processed.mapper';

@Injectable()
export class ProcessedRepositoryImpl implements ProcessedRepository {
  constructor(@InjectRepository(ProcessedEntity) private readonly processedRepository: Repository<ProcessedEntity>) {}

  async save(processed: Processed, entityManager?: EntityManager): Promise<Processed> {
    const entity = ProcessedMapper.toEntity(processed);

    if (entityManager) await entityManager.save(entity);
    else await this.processedRepository.save(entity);

    return ProcessedMapper.toDomain(entity);
  }
}
