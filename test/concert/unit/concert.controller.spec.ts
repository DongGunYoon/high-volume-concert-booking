import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserQueueAuthGuard } from 'src/common/guard/auth.guard';
import { ConcertPaymentType } from 'src/domain/concert/enum/concert.enum';
import { BookConcertSeatUseCase, BookConcertSeatUseCaseSymbol } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { PayConcertBookingUseCase, PayConcertBookingUseCaseSymbol } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { ScanBookableSchedulesUseCase, ScanBookableSchedulesUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ScanConcertSeatsUseCase, ScanConcertSeatsUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-concert-seats.use-case';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertController } from 'src/interface/presentation/concert/controller/concert.controller';
import { BookConcertSeatRequest } from 'src/interface/presentation/concert/dto/request/book-concert-seat.request';
import { PayConcertBookingRequest } from 'src/interface/presentation/concert/dto/request/pay-concert-booking.request';
import { ConcertBookingResponse } from 'src/interface/presentation/concert/dto/response/concert-booking.response';
import { ConcertPaymentResponse } from 'src/interface/presentation/concert/dto/response/concert-payment.response';
import { ConcertScheduleResponse } from 'src/interface/presentation/concert/dto/response/concert-schedule.response';
import { ConcertSeatResponse } from 'src/interface/presentation/concert/dto/response/concert-seat.response';

describe('ConcertController', () => {
  let concertController: ConcertController;
  let scanBookableSchedulesUseCase: ScanBookableSchedulesUseCase;
  let scanConcertSeatsUseCase: ScanConcertSeatsUseCase;
  let bookConcertSeatUseCase: BookConcertSeatUseCase;
  let payConcertBookingUseCase: PayConcertBookingUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        { provide: ScanBookableSchedulesUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: ScanConcertSeatsUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: BookConcertSeatUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: PayConcertBookingUseCaseSymbol, useValue: { execute: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        {
          provide: UserQueueAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    concertController = module.get<ConcertController>(ConcertController);
    scanBookableSchedulesUseCase = module.get<ScanBookableSchedulesUseCase>(ScanBookableSchedulesUseCaseSymbol);
    scanConcertSeatsUseCase = module.get<ScanConcertSeatsUseCase>(ScanConcertSeatsUseCaseSymbol);
    bookConcertSeatUseCase = module.get<BookConcertSeatUseCase>(BookConcertSeatUseCaseSymbol);
    payConcertBookingUseCase = module.get<PayConcertBookingUseCase>(PayConcertBookingUseCaseSymbol);
  });

  describe('예약 가능 콘서트 스케쥴 조회', () => {
    it('예약 가능한 콘서트 스케쥴을 조회합니다.', async () => {
      // Given
      const concert = new Concert(1, '최고의 콘서트', '최고의 콘서트입니다.');
      const schedules = [new ConcertSchedule(1, 1, new Date(), new Date(), new Date(), new Date(), concert)];
      jest.spyOn(scanBookableSchedulesUseCase, 'execute').mockResolvedValue(schedules);

      // When
      const response = await concertController.scanBookableSchedules(1);

      // Then
      expect(response[0]).toBeInstanceOf(ConcertScheduleResponse);
      expect(response[0].concertId).toBe(1);
      expect(response[0].concertTitle).toBe('최고의 콘서트');
    });
  });

  describe('예약 가능 콘서트 좌석 조회', () => {
    it('예약 가능한 콘서트 좌석을 조회합니다.', async () => {
      // Given
      const concertSeats = [new ConcertSeat(1, 1, 1, 1000, 1, false, null)];
      jest.spyOn(scanConcertSeatsUseCase, 'execute').mockResolvedValue(concertSeats);

      // When
      const response = await concertController.scanConcertSeats(1);

      // Then
      expect(response[0]).toBeInstanceOf(ConcertSeatResponse);
      expect(response[0].concertScheduleId).toBe(1);
      expect(response[0].price).toBe(1000);
      expect(response[0].number).toBe(1);
    });
  });

  describe('콘서트 좌석 예약 요청', () => {
    it('콘서트 좌석을 예약합니다.', async () => {
      // Given
      const concertBooking = new ConcertBooking(1, 1, 1, 1, 1, 1000, false, new Date());
      jest.spyOn(bookConcertSeatUseCase, 'execute').mockResolvedValue(concertBooking);

      // When
      const response = await concertController.bookConcertSeat(1, new BookConcertSeatRequest(1), { userId: 1, userQueueId: 1 });

      // Then
      expect(response).toBeInstanceOf(ConcertBookingResponse);
      expect(response.concertSeatId).toBe(1);
      expect(response.price).toBe(1000);
      expect(response.isPaid).toBe(false);
      expect(response.expiresAt).toBe(concertBooking.expiresAt);
    });
  });

  describe('콘서트 예약 결제 요청', () => {
    it('콘서트 예약 결제를 요청합니다.', async () => {
      // Given
      const concertPayment = new ConcertPayment(1, 1, 1, 1, 1, 1, 1000, ConcertPaymentType.BUY);
      jest.spyOn(payConcertBookingUseCase, 'execute').mockResolvedValue(concertPayment);

      // When
      const response = await concertController.payConcertBooking(1, new PayConcertBookingRequest(), { userId: 1, userQueueId: 1 });

      // Then
      expect(response).toBeInstanceOf(ConcertPaymentResponse);
      expect(response.price).toBe(1000);
      expect(response.type).toBe('BUY');
    });
  });
});
