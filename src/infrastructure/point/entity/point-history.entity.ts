import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('point_histories')
export class PointHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'point_id' })
  pointId: number;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: [`CHARGE`, `USE`, `REFUND`] })
  transactionType: `CHARGE` | `USE` | `REFUND`;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
