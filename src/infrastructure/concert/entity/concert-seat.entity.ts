import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ConcertScheduleEntity } from './concert-schedule.entity';
import { ConcertSeatStatus } from 'src/domain/concert/enum/concert.enum';

@Entity('concert_seats')
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

  @Column({ type: 'enum', enum: ConcertSeatStatus })
  status: ConcertSeatStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => ConcertScheduleEntity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'concert_schedule_id' })
  concertSchedule?: ConcertScheduleEntity;
}
