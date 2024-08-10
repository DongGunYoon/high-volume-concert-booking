import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ConcertEntity } from './concert.entity';

@Entity('concert_schedules')
@Index('idx_concert_schedule_concert', ['concertId'])
export class ConcertScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'concert_id' })
  concertId: number;

  @Column({ name: 'booking_start_at', type: 'timestamptz' })
  bookingStartAt: Date;

  @Column({ name: 'booking_end_at', type: 'timestamptz' })
  bookingEndAt: Date;

  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ConcertEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'concert_id' })
  concert?: ConcertEntity;
}
