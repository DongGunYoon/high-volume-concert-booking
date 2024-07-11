import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertScheduleRepository } from 'src/domain/concert/interface/repository/concert-schedule.repository';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertScheduleEntity } from '../entity/concert-schedule.entity';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { ConcertScheduleMapper } from '../mapper/concert-schedule.mapper';
import { Nullable } from 'src/common/type/native';

@Injectable()
export class ConcertScheduleRepositoryImpl implements ConcertScheduleRepository {
  constructor(@InjectRepository(ConcertScheduleEntity) private readonly concertScheduleRepository: Repository<ConcertScheduleEntity>) {}

  async existsById(id: number): Promise<boolean> {
    return await this.concertScheduleRepository.existsBy({ id });
  }

  async findOneById(id: number): Promise<Nullable<ConcertSchedule>> {
    const entity = await this.concertScheduleRepository.findOneBy({ id });

    return entity && ConcertScheduleMapper.toDomain(entity);
  }

  async findAllBookableByConcertId(concertId: number): Promise<ConcertSchedule[]> {
    const currentDate = new Date();
    const entities = await this.concertScheduleRepository.find({
      where: {
        concertId: concertId,
        bookingStartAt: LessThanOrEqual(currentDate),
        bookingEndAt: MoreThan(currentDate),
      },
      relations: { concert: true },
    });

    return entities.map(entity => ConcertScheduleMapper.toDomain(entity));
  }
}
