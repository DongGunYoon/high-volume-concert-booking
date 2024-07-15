import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from 'src/common/type/native';
import { PointRepository } from 'src/domain/point/interface/repository/point.repository';
import { Point } from 'src/domain/point/model/point.domain';
import { EntityManager, Repository } from 'typeorm';
import { PointEntity } from '../entity/point.entity';
import { PointMapper } from '../mapper/point.mapper';
import { CustomLock } from 'src/common/interface/database.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointRepositoryImpl implements PointRepository {
  constructor(@InjectRepository(PointEntity) private readonly pointRepository: Repository<PointEntity>) {}

  async findOneByUserId(userId: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<Point>> {
    let entity: Nullable<PointEntity> = null;

    if (entityManager) entity = await entityManager.findOne(PointEntity, { where: { userId }, lock });
    else entity = await this.pointRepository.findOneBy({ userId });

    return entity && PointMapper.toDomain(entity);
  }

  async save(point: Point, entityManager?: EntityManager): Promise<Point> {
    const entity = PointMapper.toEntity(point);

    if (entityManager) await entityManager.save(entity);
    else await this.pointRepository.save(entity);

    return PointMapper.toDomain(entity);
  }
}
