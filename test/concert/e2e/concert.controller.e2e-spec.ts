import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from 'src/common/dto/api.response';
import { ConcertPaymentType } from 'src/domain/concert/enum/concert.enum';
import { PointTransactionType } from 'src/domain/point/enum/point.enum';
import { ConcertBookingResponse } from 'src/interface/presentation/concert/dto/response/concert-booking.response';
import { ConcertPaymentResponse } from 'src/interface/presentation/concert/dto/response/concert-payment.response';
import { ConcertScheduleResponse } from 'src/interface/presentation/concert/dto/response/concert-schedule.response';
import { ConcertSeatResponse } from 'src/interface/presentation/concert/dto/response/concert-seat.response';
import { ConcertResponse } from 'src/interface/presentation/concert/dto/response/concert.response';
import * as request from 'supertest';
import { TestAppModule } from 'test/common/test-app.module';
import { TestDataService } from 'test/common/test-data.service';

describe('ConcertController (e2e)', () => {
  let app: INestApplication;
  let cacheManager: Cache;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    testDataService = module.get<TestDataService>(TestDataService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  beforeEach(async () => {
    await cacheManager.reset();
  });

  afterAll(async () => {
    await testDataService.cleanUpTestData();
    await app.close();
  });

  describe('콘서트 목록 조회 - GET /concerts', () => {
    it('아무런 콘서트가 생성되지 않았다면 빈 배열을 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertResponse, result.data as ConcertResponse[]);

      expect(response).toHaveLength(0);
    });

    it('생성되어 있는 콘서트가 존재한다면, 해당 목록을 반환합니다.', async () => {
      // Given
      await Promise.all(Array.from({ length: 10 }, (_, i) => testDataService.createConcert(`콘서트${i}`)));
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertResponse, result.data as ConcertResponse[]);

      expect(response).toHaveLength(10);
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts`)
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });

  describe('콘서트 스케쥴 목록 조회 - GET /concerts/:concertId/schedules/bookable', () => {
    it('아무런 콘서트 스케쥴이 생성되지 않았다면 빈 배열을 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/${concert.id}/schedules/bookable`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertScheduleResponse, result.data as ConcertScheduleResponse[]);

      expect(response).toHaveLength(0);
    });

    it('콘서트 스케쥴이 여러 개 존재한다면, 예약 가능한 스케쥴 목록을 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      await Promise.all(Array.from({ length: 5 }, () => testDataService.createBookableSchedule(concert.id)));
      await Promise.all(Array.from({ length: 3 }, () => testDataService.createNonBookableSchedule(concert.id)));

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/${concert.id}/schedules/bookable`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertScheduleResponse, result.data as ConcertScheduleResponse[]);

      expect(response).toHaveLength(5);
      expect(response[0].concertTitle).toBe(concert.title);
      expect(response[0].concertId).toBe(concert.id);
    });

    it('입력한 ID에 콘서트가 존재하지 않다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const nonExistConcertId = -1;

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/${nonExistConcertId}/schedules/bookable`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
      expect(response.message).toBe('콘서트가 존재하지 않습니다.');
      expect(response.data).toBeNull();
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const concert = await testDataService.createConcert('콘서트');

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/${concert.id}/schedules/bookable`)
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });

  describe('콘서트 좌석 목록 조회 - GET /concerts/schedules/:concertScheduleId/seats', () => {
    it('아무런 콘서트 좌석이 생성되지 않았다면 빈 배열을 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/schedules/${schedule.id}/seats`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertSeatResponse, result.data as ConcertSeatResponse[]);

      expect(response).toHaveLength(0);
    });

    it('콘서트 좌석이 여러 개 존재한다면, 해당 스케쥴 목록을 반환합니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      await Promise.all(Array.from({ length: 4 }, () => testDataService.createSeat(concert.id, schedule.id)));

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/schedules/${schedule.id}/seats`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertSeatResponse, result.data as ConcertSeatResponse[]);

      expect(response).toHaveLength(4);
      expect(response[0].concertScheduleId).toBe(schedule.id);
    });

    it('입력한 ID에 콘서트 스케쥴이 존재하지 않다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const nonExistScheduleId = -1;

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/schedules/${nonExistScheduleId}/seats`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
      expect(response.message).toBe('콘서트 스케쥴이 존재하지 않습니다.');
      expect(response.data).toBeNull();
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);

      // When
      const result = await request(app.getHttpServer())
        .get(`/concerts/schedules/${schedule.id}/seats`)
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });

  describe('콘서트 좌석 예약 - POST /concerts/seats/:concertSeatId/book', () => {
    it('콘서트 좌석 예약이 성공적으로 이루어지면, 예약 정보가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertBookingResponse, result.data);

      expect(response.concertSeatId).toBe(seat.id);
      expect(response.price).toBe(seat.price);
      expect(response.isPaid).toBe(false);
    });

    it('콘서트 좌석 예약이 성공적으로 이루어지면, 좌석이 점유 상태로 변경됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const reservedSeat = await testDataService.getSeat(seat.id);

      expect(reservedSeat.id).toBe(seat.id);
      expect(reservedSeat.reservedUntil).not.toBeNull();
      expect(reservedSeat.isAvailable()).toBe(false);
    });

    it('콘서트 좌석 예약이 성공적으로 이루어지면, 콘서트 예약 데이터가 생성됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const booking = await testDataService.getBooking(seat.id);

      expect(booking.concertId).toBe(concert.id);
      expect(booking.concertScheduleId).toBe(schedule.id);
      expect(booking.concertSeatId).toBe(seat.id);
      expect(booking.isPaid).toBe(false);
    });

    it('콘서트 스케쥴의 예약 가능 시간이 지났다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createNonBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('이미 예약 신청 가능 일자가 지났습니다.');
      expect(response.data).toBeNull();
    });

    it('콘서트 좌석이 이미 예약이 되었다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(409);
      expect(response.message).toBe('선택한 콘서트 좌석은 이미 예약되었습니다.');
      expect(response.data).toBeNull();
    });

    it('콘서트 좌석이 이미 판매가 되었다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, true);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(409);
      expect(response.message).toBe('선택한 콘서트 좌석은 이미 판매되었습니다.');
      expect(response.data).toBeNull();
    });

    it('입력한 ID에 콘서트 좌석이 존재하지 않다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const nonExistSeatId = -1;

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${nonExistSeatId}/book`)
        .send({ concertScheduleId: schedule.id })
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
      expect(response.message).toBe('콘서트 좌석이 존재하지 않습니다.');
      expect(response.data).toBeNull();
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/seats/${seat.id}/book`)
        .send({ concertScheduleId: schedule.id })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });

  describe('예약 콘서트 결제 - POST /concerts/bookings/:concertBookingId/pay', () => {
    it('예약한 콘서트의 결제가 성공적으로 이루어지면, 결제 정보가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));
      await testDataService.setPoint(user.id, 10000);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response = plainToInstance(ConcertPaymentResponse, result.data);

      expect(response.price).toBe(seat.price);
      expect(response.type).toBe(ConcertPaymentType.BUY);
    });

    it('예약한 콘서트의 결제가 성공적으로 이루어지면, 콘서트 좌석이 결제됨 상태로 변경됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));
      await testDataService.setPoint(user.id, 10000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const paidSeat = await testDataService.getSeat(seat.id);

      expect(paidSeat.id).toBe(seat.id);
      expect(paidSeat.isAvailable()).toBe(false);
      expect(paidSeat.isPaid).toBe(true);
    });

    it('예약한 콘서트의 결제가 성공적으로 이루어지면, 콘서트 예약이 결제됨 상태로 변경됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));
      await testDataService.setPoint(user.id, 10000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const paidBooking = await testDataService.getBooking(seat.id);

      expect(paidBooking.id).toBe(booking.id);
      expect(paidBooking.isPaid).toBe(true);
    });

    it('예약한 콘서트의 결제가 성공적으로 이루어지면, 포인트 사용 내역이 생성됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));
      await testDataService.setPoint(user.id, 10000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const pointHistory = await testDataService.getPointHistory(user.id);

      expect(pointHistory.amount).toBe(booking.price);
      expect(pointHistory.transactionType).toBe(PointTransactionType.USE);
    });

    it('예약한 콘서트의 결제가 성공적으로 이루어지면, 콘서트 결제 데이터가 생성됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));
      await testDataService.setPoint(user.id, 10000);

      // When
      await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const payment = await testDataService.getPayment(booking.id);

      expect(payment.concertId).toBe(concert.id);
      expect(payment.concertScheduleId).toBe(schedule.id);
      expect(payment.concertSeatId).toBe(seat.id);
      expect(payment.price).toBe(booking.price);
      expect(payment.type).toBe(ConcertPaymentType.BUY);
    });

    it('콘서트 결제에 필요한 금액이 모자르다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('결제에 필요한 금액이 모자릅니다.');
      expect(response.data).toBeNull();
    });

    it('콘서트 예약자가 아닌 유저가 결제를 시도하면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const reserver = await testDataService.createUser('예약자');
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, reserver.id, new Date(Date.now() + 10000));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('내가 예약한 콘서트만 결제 가능합니다.');
      expect(response.data).toBeNull();
    });

    it('이미 결제가 진행된 예약에 결제를 시도하면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const alreadyPaidBooking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000), true);

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${alreadyPaidBooking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('이미 결제가 처리되었습니다.');
      expect(response.data).toBeNull();
    });

    it('결제 만료시간이 지난 예약에 결제를 시도하면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const expiredBooking = await testDataService.createBooking(seat, user.id, new Date(Date.now()));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${expiredBooking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('결제 만료 시간이 초과되었습니다.');
      expect(response.data).toBeNull();
    });

    it('좌석 점유시간이 지난 예약에 결제를 시도하면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const expiredSeat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now()));
      const booking = await testDataService.createBooking(expiredSeat, user.id, new Date(Date.now() + 10000));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.message).toBe('좌석이 예약된 상태가 아닙니다.');
      expect(response.data).toBeNull();
    });

    it('입력한 ID에 콘서트 예약이 존재하지 않다면, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const tokenQueue = await testDataService.createActiveTokenQueue(user.id);
      const concert = await testDataService.createConcert('콘서트');
      await testDataService.createBookableSchedule(concert.id);
      const nonExistBookingId = -1;

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${nonExistBookingId}/pay`)
        .auth(tokenQueue.token!, { type: 'bearer' })
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
      expect(response.message).toBe('콘서트 예약이 존재하지 않습니다.');
      expect(response.data).toBeNull();
    });

    it('토큰 정보가 없는 요청은, 관련된 에러가 반환됩니다.', async () => {
      // Given
      const user = await testDataService.createUser('유저');
      const concert = await testDataService.createConcert('콘서트');
      const schedule = await testDataService.createBookableSchedule(concert.id);
      const seat = await testDataService.createSeat(concert.id, schedule.id, 1000, false, new Date(Date.now() + 10000));
      const booking = await testDataService.createBooking(seat, user.id, new Date(Date.now() + 10000));

      // When
      const result = await request(app.getHttpServer())
        .post(`/concerts/bookings/${booking.id}/pay`)
        .expect(200)
        .then(res => res.body);

      // Then
      const response: ApiResponse<null> = result;

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(401);
      expect(response.message).toBe('인증 토큰이 제공되지 않았습니다.');
      expect(response.data).toBeNull();
    });
  });
});
