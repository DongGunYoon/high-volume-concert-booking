export class ConcertSeatResponse {
  constructor(
    public id: number,
    public concertScheduleId: number,
    public price: number,
    public number: number,
    public status: `PURCHASED` | `RESERVED` | `AVAILABLE`,
  ) {}
}
