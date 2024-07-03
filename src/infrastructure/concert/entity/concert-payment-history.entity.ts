import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert_payment_histories')
export class ConcertPaymentHistoryEntity {
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

  @Column({ name: 'concert_booking_id' })
  concertBookingId: number;

  @Column({ name: 'concert_title', length: 200 })
  concertTitle: string;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: [`BUY`, `REFUND`] })
  type: 'BUY' | 'REFUND';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
