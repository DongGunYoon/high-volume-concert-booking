import { Concert } from './concert.domain';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

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
      throw new CustomException(ErrorCode.BOOKING_NOT_STARTED);
    }

    if (this.bookingEndAt < new Date()) {
      throw new CustomException(ErrorCode.BOOKING_ALREADY_PASSED);
    }
  }
}
