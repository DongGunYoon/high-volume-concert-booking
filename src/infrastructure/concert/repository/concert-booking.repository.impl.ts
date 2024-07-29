import { Injectable } from '@nestjs/common';
import { ConcertBookingRepository } from 'src/domain/concert/interface/repository/concert-booking.repository';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { ConcertBookingMapper } from '../mapper/concert-booking.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertBookingEntity } from '../entity/concert-booking.entity';
import { Nullable } from 'src/common/type/native';
import { CustomLock } from 'src/common/interface/database.interface';

@Injectable()
export class ConcertBookingRepositoryImpl implements ConcertBookingRepository {
  constructor(@InjectRepository(ConcertBookingEntity) private readonly concertBookingRepository: Repository<ConcertBookingEntity>) {}

  async findOneById(id: number, entityManager?: EntityManager, lock?: CustomLock): Promise<Nullable<ConcertBooking>> {
    let entity: Nullable<ConcertBookingEntity> = null;

    if (entityManager) entity = await entityManager.findOne(ConcertBookingEntity, { where: { id }, lock });
    else entity = await this.concertBookingRepository.findOneBy({ id });

    return entity && ConcertBookingMapper.toDomain(entity);
  }

  async save(concertBooking: ConcertBooking, entityManager?: EntityManager): Promise<ConcertBooking> {
    const entity = ConcertBookingMapper.toEntity(concertBooking);

    if (entityManager) await entityManager.save(entity);
    else await this.concertBookingRepository.save(entity);

    return ConcertBookingMapper.toDomain(entity);
  }

  async update(concertBooking: ConcertBooking, entityManager?: EntityManager): Promise<boolean> {
    const entity = ConcertBookingMapper.toEntity(concertBooking);
    let result: UpdateResult;

    if (entityManager) {
      result = await entityManager.update(ConcertBookingEntity, { id: entity.id, version: entity.version }, { ...entity, version: entity.version + 1 });
    } else {
      result = await this.concertBookingRepository.update({ id: entity.id, version: entity.version }, { ...entity, version: entity.version + 1 });
    }

    return !!result.affected;
  }
}
