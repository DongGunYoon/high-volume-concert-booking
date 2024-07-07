export class ConcertPaymentHistoryResponse {
  constructor(
    public id: number,
    public concertTitle: string,
    public price: number,
    public type: 'BUY' | 'REFUND',
  ) {}
}
