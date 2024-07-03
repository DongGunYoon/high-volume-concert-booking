import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('concert_schedules')
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
}
