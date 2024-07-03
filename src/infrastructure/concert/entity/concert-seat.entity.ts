import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ type: 'enum', enum: [`PURCHASED`, `RESERVED`, `AVAILABLE`] })
  status: `PURCHASED` | `RESERVED` | `AVAILABLE`;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
