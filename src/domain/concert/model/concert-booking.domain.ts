import { BadRequestException } from '@nestjs/common';
import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';

export class ConcertBooking {
  constructor(
    public id: number,
    public userId: number,
    public concertId: number,
    public concertScheduleId: number,
    public concertSeatId: number,
    public price: number,
    public isPaid: boolean,
    public expiresAt: Date,
  ) {}

  static create(dto: CreateConcertBookingDTO): ConcertBooking {
    const expiresAt = this.calculateExpiryTime();

    return new ConcertBooking(0, dto.userId, dto.concertId, dto.concertScheduleId, dto.concertSeatId, dto.price, false, expiresAt);
  }

  private static calculateExpiryTime(): Date {
    const now = new Date();

    now.setMinutes(now.getMinutes() + 5);

    return now;
  }

  pay(userId: number): void {
    if (this.userId !== userId) {
      throw new BadRequestException('내가 예약한 콘서트만 결제 가능합니다.');
    }

    if (this.isPaid) {
      throw new BadRequestException('이미 결제가 처리되었습니다.');
    }

    if (this.expiresAt < new Date()) {
      throw new BadRequestException('결제 만료 시간이 초과되었습니다.');
    }

    this.isPaid = true;
  }
}
