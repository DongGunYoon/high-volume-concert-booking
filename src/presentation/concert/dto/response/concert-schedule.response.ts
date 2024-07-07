export class ConcertScheduleResponse {
  constructor(
    public id: number,
    public concertId: number,
    public bookingStartAt: Date,
    public bookingEndAt: Date,
    public startAt: Date,
    public endAt: Date,
    public concertName: string,
  ) {}
}
