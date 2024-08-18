import { ProcessedStatus } from 'src/domain/processed/enum/processed.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('processed')
@Unique('unique_idx_processed_outbox_id', ['outboxId'])
export class ProcessedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'outbox_id' })
  outboxId: number;

  @Column({ type: 'enum', enum: ProcessedStatus })
  status: ProcessedStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
