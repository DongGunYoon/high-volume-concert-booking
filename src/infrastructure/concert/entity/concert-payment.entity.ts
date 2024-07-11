import { ConcertPaymentType } from 'src/domain/concert/enum/concert.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('concert_payment_histories')
export class ConcertPaymentEntity {
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

  @Column()
  price: number;

  @Column({ type: 'enum', enum: ConcertPaymentType })
  type: ConcertPaymentType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
