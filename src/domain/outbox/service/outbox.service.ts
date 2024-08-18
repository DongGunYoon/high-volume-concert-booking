import { Inject, Injectable } from '@nestjs/common';
import { OutboxRepository, OutboxRepositorySymbol } from '../interface/outbox.repository';
import { CreateOutboxDTO } from '../dto/create-outbox.dto';
import { Outbox } from '../model/outbox.domain';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { EntityManager } from 'typeorm';

@Injectable()
export class OutboxService {
  constructor(@Inject(OutboxRepositorySymbol) private readonly outboxRepository: OutboxRepository) {}

  async create(dto: CreateOutboxDTO, entityManager?: EntityManager): Promise<Outbox> {
    const outbox = Outbox.create(dto);

    return await this.outboxRepository.save(outbox, entityManager);
  }

  async toPublished(id: number): Promise<Outbox> {
    const outbox = await this.findOneById(id);

    outbox.toPublished();

    return await this.outboxRepository.save(outbox);
  }

  async findFailed(): Promise<Outbox[]> {
    const estimateFailedDate = new Date(Date.now() - 1000 * 60 * 3);
    const outboxes = await this.outboxRepository.findInitCreatedBefore(estimateFailedDate);

    return outboxes;
  }

  async removeOldPublishedOutboxes(): Promise<void> {
    const estimateOldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10);

    await this.outboxRepository.removePublishedCreatedBefore(estimateOldDate);
  }

  private async findOneById(id: number): Promise<Outbox> {
    const outbox = await this.outboxRepository.findOneById(id);

    if (outbox == null) {
      throw new CustomException(ErrorCode.OUTBOX_NOT_FOUND);
    }

    return outbox;
  }
}
