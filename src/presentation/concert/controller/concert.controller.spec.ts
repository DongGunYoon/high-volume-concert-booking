import { Test } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertScheduleResponse } from '../dto/response/concert-schedule.response';
import { ConcertSeatResponse } from '../dto/response/concert-seat.response';
import { ConcertBookingResponse } from '../dto/response/concert-booking.response';
import { ConcertPaymentHistoryResponse } from '../dto/response/concert-payment-history.response';

describe('ConcertController', () => {
  let concertController: ConcertController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ConcertController],
    }).compile();

    concertController = module.get<ConcertController>(ConcertController);
  });

  describe('예약 가능 콘서트 스케쥴 조회', () => {
    it('예약 가능한 콘서트 스케쥴을 조회합니다.', async () => {
      // Given
      const concertId = 1;

      // When
      const bookableConcertSchedules = await concertController.scanBookableSchedules(concertId);

      // Then
      expect(bookableConcertSchedules[0]).toBeInstanceOf(ConcertScheduleResponse);
      expect(bookableConcertSchedules[0].concertId).toBe(concertId);
      expect(bookableConcertSchedules[0].concertName).toBe('최고의 콘서트');
    });
  });

  describe('예약 가능 콘서트 좌석 조회', () => {
    it('예약 가능한 콘서트 좌석을 조회합니다.', async () => {
      // Given
      const concertScheduleId = 1;

      // When
      const concertSeats = await concertController.scanConcertSeats(concertScheduleId);

      // Then
      expect(concertSeats[0]).toBeInstanceOf(ConcertSeatResponse);
      expect(concertSeats[0].concertScheduleId).toBe(concertScheduleId);
      expect(concertSeats[0].price).toBe(10000);
      expect(concertSeats[0].number).toBe(1);
    });
  });

  describe('콘서트 좌석 예약 요청', () => {
    it('콘서트 좌석을 예약합니다.', async () => {
      // Given
      const concertSeatId = 1;

      // When
      const concertBooking = await concertController.bookConcertSeat(concertSeatId);

      // Then
      expect(concertBooking).toBeInstanceOf(ConcertBookingResponse);
      expect(concertBooking.concertSeatId).toBe(concertSeatId);
      expect(concertBooking.status).toBe('PENDING');
    });
  });

  describe('콘서트 예약 결제 요청', () => {
    it('콘서트 예약 결제를 요청합니다.', async () => {
      // Given
      const concertBookingId = 1;

      // When
      const concertPaymentHistory = await concertController.payConcertBooking(concertBookingId);

      // Then
      expect(concertPaymentHistory).toBeInstanceOf(ConcertPaymentHistoryResponse);
      expect(concertPaymentHistory.concertTitle).toBe('최고의 콘서트');
      expect(concertPaymentHistory.price).toBe(10000);
      expect(concertPaymentHistory.type).toBe('BUY');
    });
  });
});
