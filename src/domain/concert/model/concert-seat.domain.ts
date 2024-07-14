import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConcertSeatStatus } from '../enum/concert.enum';
import { ConcertSchedule } from './concert-schedule.domain';

export class ConcertSeat {
  constructor(
    public id: number,
    public concertId: number,
    public concertScheduleId: number,
    public price: number,
    public number: number,
    public status: ConcertSeatStatus,
    public concertSchedule?: ConcertSchedule,
  ) {}

  book(): void {
    if (this.status !== ConcertSeatStatus.AVAILABLE) {
      throw new ConflictException('선택한 콘서트 좌석은 이미 예약/판매되었습니다.');
    }

    this.status = ConcertSeatStatus.RESERVED;
  }

  pay(): void {
    if (this.status !== ConcertSeatStatus.RESERVED) {
      throw new BadRequestException('좌석이 예약된 상태가 아닙니다.');
    }

    this.status = ConcertSeatStatus.PURCHASED;
  }
}
