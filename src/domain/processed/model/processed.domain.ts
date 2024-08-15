import { CreateProcessedDTO } from '../dto/create-processed.dto';
import { ProcessedStatus } from '../enum/processed.enum';

export class Processed {
  constructor(
    public id: number,
    public outboxId: number,
    public status: ProcessedStatus,
  ) {}

  static create(dto: CreateProcessedDTO): Processed {
    return new Processed(0, dto.outboxId, ProcessedStatus.RECEIVED);
  }

  toSuccess(): void {
    this.status = ProcessedStatus.SUCCESS;
  }
}
