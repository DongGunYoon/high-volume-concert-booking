import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';

export class ConcertScheduleResponse {
  constructor(
    public id: number,
    public concertId: number,
    public bookingStartAt: Date,
    public bookingEndAt: Date,
    public startAt: Date,
    public endAt: Date,
    public concertTitle: string,
  ) {}

  static from(concertSchedule: ConcertSchedule): ConcertScheduleResponse {
    return new ConcertScheduleResponse(
      concertSchedule.id,
      concertSchedule.concertId,
      concertSchedule.bookingStartAt,
      concertSchedule.bookingEndAt,
      concertSchedule.startAt,
      concertSchedule.endAt,
      concertSchedule.concert!.title,
    );
  }
}
