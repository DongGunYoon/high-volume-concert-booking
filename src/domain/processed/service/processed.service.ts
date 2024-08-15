import { Inject, Injectable } from '@nestjs/common';
import { CreateProcessedDTO } from '../dto/create-processed.dto';
import { Processed } from '../model/processed.domain';
import { ProcessedRepository, ProcessedRepositorySymbol } from '../interface/processed.repository';

@Injectable()
export class ProcessedService {
  constructor(@Inject(ProcessedRepositorySymbol) private readonly processedRepository: ProcessedRepository) {}

  async create(dto: CreateProcessedDTO): Promise<Processed> {
    const processed = Processed.create(dto);

    return await this.processedRepository.save(processed);
  }

  async toSuccess(processed: Processed): Promise<void> {
    processed.toSuccess();

    await this.processedRepository.save(processed);
  }
}
