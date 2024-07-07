export class ConcertBookingResponse {
  constructor(
    public id: number,
    public concertSeatId: number,
    public status: `PENDING` | `COMPLETED` | `CANCELLED` | 'EXPIRED',
    public expiresAt: Date,
  ) {}
}
