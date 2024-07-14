import { BadRequestException } from '@nestjs/common';
import { Concert } from './concert.domain';

export class ConcertSchedule {
  constructor(
    public id: number,
    public concertId: number,
    public bookingStartAt: Date,
    public bookingEndAt: Date,
    public startAt: Date,
    public endAt: Date,
    public concert?: Concert,
  ) {}

  validateBookable(): void {
    if (this.bookingStartAt > new Date()) {
      throw new BadRequestException('아직 예약 신청 가능 일자가 아닙니다.');
    }

    if (this.bookingEndAt < new Date()) {
      throw new BadRequestException('이미 예약 신청 가능 일자가 지났습니다.');
    }
  }
}
