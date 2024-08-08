import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { ConcertScheduleEntity } from './concert-schedule.entity';
import { Nullable } from 'src/common/type/native';

@Entity('concert_seats')
@Index('idx_concert_seat_concert_schedule', ['concertScheduleId'])
export class ConcertSeatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'concert_id' })
  concertId: number;

  @Column({ name: 'concert_schedule_id' })
  concertScheduleId: number;

  @Column()
  price: number;

  @Column()
  number: number;

  @Column({ name: 'is_paid' })
  isPaid: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  reservedUntil: Nullable<Date>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ConcertScheduleEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'concert_schedule_id' })
  concertSchedule?: ConcertScheduleEntity;

  @VersionColumn({ default: 0 })
  version: number;
}
