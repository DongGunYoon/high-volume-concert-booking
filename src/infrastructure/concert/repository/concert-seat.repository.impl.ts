import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertSeatRepository } from 'src/domain/concert/interface/repository/concert-seat.repository';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { ConcertSeatEntity } from '../entity/concert-seat.entity';
import { EntityManager, Repository } from 'typeorm';
import { ConcertSeatMapper } from '../mapper/concert-seat.mapper';
import { Nullable } from 'src/common/type/native';
import { CustomLock } from 'src/common/interface/database.interface';

@Injectable()
export class ConcertSeatRepositoryImpl implements ConcertSeatRepository {
  constructor(@InjectRepository(ConcertSeatEntity) private readonly concertSeatRepository: Repository<ConcertSeatEntity>) {}

  async findOneById(id: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<ConcertSeat>> {
    let entity: Nullable<ConcertSeatEntity> = null;

    if (entityManager) entity = await entityManager.findOne(ConcertSeatEntity, { where: { id }, lock });
    else entity = await this.concertSeatRepository.findOneBy({ id });

    return entity && ConcertSeatMapper.toDomain(entity);
  }

  async findAllByConcertScheduleId(concertScheduleId: number): Promise<ConcertSeat[]> {
    const entities = await this.concertSeatRepository.findBy({ concertScheduleId });

    return entities.map(entity => ConcertSeatMapper.toDomain(entity));
  }

  async save(concertSeat: ConcertSeat, entityManager?: EntityManager): Promise<ConcertSeat> {
    const entity = ConcertSeatMapper.toEntity(concertSeat);

    if (entityManager) await entityManager.save(entity);
    else await this.concertSeatRepository.save(entity);

    return ConcertSeatMapper.toDomain(entity);
  }
}
