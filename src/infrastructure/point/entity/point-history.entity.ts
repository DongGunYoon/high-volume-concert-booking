import { PointTransactionType } from 'src/domain/point/enum/point.enum';
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

  @Column({ type: 'enum', enum: PointTransactionType })
  transactionType: PointTransactionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
