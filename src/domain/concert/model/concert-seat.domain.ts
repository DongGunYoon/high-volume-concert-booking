import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConcertSchedule } from './concert-schedule.domain';
import { Nullable } from 'src/common/type/native';

export class ConcertSeat {
  constructor(
    public id: number,
    public concertId: number,
    public concertScheduleId: number,
    public price: number,
    public number: number,
    public isPaid: boolean,
    public reservedUntil: Nullable<Date>,
    public concertSchedule?: ConcertSchedule,
  ) {}

  book(): void {
    if (this.reservedUntil && this.reservedUntil > new Date()) {
      throw new ConflictException('선택한 콘서트 좌석은 이미 예약되었습니다.');
    }

    if (this.isPaid) {
      throw new ConflictException('선택한 콘서트 좌석은 이미 판매되었습니다.');
    }

    this.reservedUntil = new Date(Date.now() + 5 * 60 * 1000);
  }

  pay(): void {
    if (this.isPaid) {
      throw new ConflictException('선택한 콘서트 좌석은 이미 판매되었습니다.');
    }

    if (this.reservedUntil == null || this.reservedUntil < new Date()) {
      throw new BadRequestException('좌석이 예약된 상태가 아닙니다.');
    }

    this.isPaid = true;
  }

  isAvailable(): boolean {
    if (this.isPaid) return false;
    if (this.reservedUntil && this.reservedUntil > new Date()) return false;

    return true;
  }
}
