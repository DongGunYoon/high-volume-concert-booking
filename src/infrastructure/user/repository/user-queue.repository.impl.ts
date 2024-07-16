import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQueueRepository } from 'src/domain/user/interface/repository/user-queue.repository';
import { UserQueueEntity } from '../entity/user-queue.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { Nullable } from 'src/common/type/native';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { UserQueueMapper } from '../mapper/user-queue.mapper';

@Injectable()
export class UserQueueRepositoryImpl implements UserQueueRepository {
  constructor(@InjectRepository(UserQueueEntity) private readonly userQueueRepository: Repository<UserQueueEntity>) {}

  async findOldestPending(): Promise<Nullable<UserQueue>> {
    const entity = await this.userQueueRepository.findOne({ where: { token: IsNull() }, order: { id: 'ASC' } });

    return entity && UserQueueMapper.toDomain(entity);
  }

  async findPendingQueues(count: number): Promise<UserQueue[]> {
    const entities = await this.userQueueRepository.find({ where: { token: IsNull() }, take: count, order: { id: 'ASC' } });

    return entities.map(entity => UserQueueMapper.toDomain(entity));
  }

  async findUnexpiredByUserId(userId: number): Promise<Nullable<UserQueue>> {
    const entity = await this.userQueueRepository.findOne({ where: { userId, expiresAt: MoreThan(new Date()) } });

    return entity && UserQueueMapper.toDomain(entity);
  }

  async findOneById(id: number): Promise<Nullable<UserQueue>> {
    const entity = await this.userQueueRepository.findOne({ where: { id } });

    return entity && UserQueueMapper.toDomain(entity);
  }

  async expireById(id: number): Promise<void> {
    await this.userQueueRepository.update({ id }, { expiresAt: new Date() });
  }

  async save(userQueue: UserQueue): Promise<UserQueue> {
    const entity = await this.userQueueRepository.save(UserQueueMapper.toEntity(userQueue));

    return UserQueueMapper.toDomain(entity);
  }

  async bulkSave(userQueues: UserQueue[]): Promise<UserQueue[]> {
    const entities = await this.userQueueRepository.save(userQueues.map(uq => UserQueueMapper.toEntity(uq)));

    return entities.map(entity => UserQueueMapper.toDomain(entity));
  }
}
