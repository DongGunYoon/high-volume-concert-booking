import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('concert_bookings')
export class ConcertBookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'concert_id' })
  concertId: number;

  @Column({ name: 'concert_schedule_id' })
  concertScheduleId: number;

  @Column({ name: 'concert_seat_id' })
  concertSeatId: number;

  @Column({ type: 'enum', enum: [`PENDING`, `COMPLETED`, `CANCELLED`, 'EXPIRED'] })
  status: `PENDING` | `COMPLETED` | `CANCELLED` | 'EXPIRED';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
