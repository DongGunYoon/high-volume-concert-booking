import { ConcertSchedule } from './concert-schedule.domain';
import { Nullable } from 'src/common/type/native';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

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
    public version?: number,
  ) {}

  book(): void {
    if (this.reservedUntil && this.reservedUntil > new Date()) {
      throw new CustomException(ErrorCode.SEAT_ALREADY_BOOKED);
    }

    if (this.isPaid) {
      throw new CustomException(ErrorCode.SEAT_ALREADY_SOLD);
    }

    this.reservedUntil = new Date(Date.now() + 5 * 60 * 1000);
  }

  pay(): void {
    if (this.isPaid) {
      throw new CustomException(ErrorCode.SEAT_ALREADY_SOLD);
    }

    if (this.reservedUntil == null || this.reservedUntil < new Date()) {
      throw new CustomException(ErrorCode.SEAT_NOT_RESERVED);
    }

    this.isPaid = true;
  }

  isAvailable(): boolean {
    if (this.isPaid) return false;
    if (this.reservedUntil && this.reservedUntil > new Date()) return false;

    return true;
  }
}
