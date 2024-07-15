import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Index('unique_pending_booking', ['concertSeatId'], { where: "'isPaid' = 'true'", unique: true })
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

  @Column()
  price: number;

  @Column({ name: 'is_paid' })
  isPaid: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
