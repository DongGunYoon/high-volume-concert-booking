import { CreateOutboxDTO } from '../dto/create-outbox.dto';
import { OutboxStatus } from '../enum/outbox.enum';

export class Outbox {
  constructor(
    public id: number,
    public topic: string,
    public message: string,
    public status: OutboxStatus,
  ) {}

  static create(dto: CreateOutboxDTO): Outbox {
    return new Outbox(0, dto.topic, dto.message, OutboxStatus.INIT);
  }

  toPublished(): void {
    this.status = OutboxStatus.PUBLISHED;
  }
}
