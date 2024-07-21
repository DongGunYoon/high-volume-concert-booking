import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';

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
      throw new CustomException(ErrorCode.UNAUTHORIZED_CONCERT_PAYMENT);
    }

    if (this.isPaid) {
      throw new CustomException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
    }

    if (this.expiresAt < new Date()) {
      throw new CustomException(ErrorCode.PAYMENT_EXPIRED);
    }

    this.isPaid = true;
  }
}
