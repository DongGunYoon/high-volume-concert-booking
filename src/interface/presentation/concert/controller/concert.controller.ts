import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ConcertScheduleResponse } from '../dto/response/concert-schedule.response';
import { ConcertSeatResponse } from '../dto/response/concert-seat.response';
import { ConcertBookingResponse } from '../dto/response/concert-booking.response';
import { ConcertPaymentResponse } from '../dto/response/concert-payment.response';
import { ScanBookableSchedulesUseCase, ScanBookableSchedulesUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-bookable-schedules.use-case';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserQueueAuthGuard } from 'src/common/guard/auth.guard';
import { ScanConcertSeatsUseCase, ScanConcertSeatsUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-concert-seats.use-case';
import { BookConcertSeatUseCase, BookConcertSeatUseCaseSymbol } from 'src/domain/concert/interface/use-case/book-concert-seat.use-case';
import { TokenPayload } from 'src/common/decorator/auth.decorator';
import { UserQueueTokenPayload } from 'src/common/interface/auth.interface';
import { BookConcertSeatRequest } from '../dto/request/book-concert-seat.request';
import { PayConcertBookingUseCase, PayConcertBookingUseCaseSymbol } from 'src/domain/concert/interface/use-case/pay-concert-booking.use-case';
import { PayConcertBookingRequest } from '../dto/request/pay-concert-booking.request';
import { ConcertResponse } from '../dto/response/concert.response';
import { ScanConcertsUseCase, ScanConcertsUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-concerts.use-case';
import { CreateConcertRequest } from '../dto/request/create-concert.request';
import { CreateConcertUseCase } from 'src/application/concert/use-case/create-concert.use-case.impl';
import { CreateConcertScheduleRequest } from '../dto/request/create-concert-schedule.request';
import { CreateConcertScheduleUseCase } from 'src/application/concert/use-case/create-concert-schedule.use-case.impl';

@ApiTags('콘서트 관련 API')
@Controller('concerts')
export class ConcertController {
  constructor(
    private readonly createConcertUseCase: CreateConcertUseCase,
    private readonly createConcertScheduleUseCase: CreateConcertScheduleUseCase,
    @Inject(ScanConcertsUseCaseSymbol) private readonly scanConcertsUseCase: ScanConcertsUseCase,
    @Inject(ScanBookableSchedulesUseCaseSymbol) private readonly scanBookableScheduelsUseCase: ScanBookableSchedulesUseCase,
    @Inject(ScanConcertSeatsUseCaseSymbol) private readonly scanConcertSeatsUseCase: ScanConcertSeatsUseCase,
    @Inject(BookConcertSeatUseCaseSymbol) private readonly bookConcertSeatUseCase: BookConcertSeatUseCase,
    @Inject(PayConcertBookingUseCaseSymbol) private readonly payConcertBookingUseCase: PayConcertBookingUseCase,
  ) {}

  /**
   * 콘서트를 생성합니다.
   * @summary 콘서트 생성
   * @returns
   */
  @Post()
  async createConcert(@Body() request: CreateConcertRequest): Promise<ConcertResponse> {
    const concert = await this.createConcertUseCase.execute(request.toUseCaseDTO());

    return ConcertResponse.from(concert);
  }

  /**
   * 콘서트 목록을 조회합니다.
   * @summary 콘서트 목록 조회
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserQueueAuthGuard)
  @Get()
  async scanConcerts(): Promise<ConcertResponse[]> {
    const concerts = await this.scanConcertsUseCase.execute();

    return concerts.map(concert => ConcertResponse.from(concert));
  }

  /**
   * 콘서트 스케쥴을 생성합니다.
   * @summary 콘서트 스케쥴 생성
   * @returns
   */
  @Post(':concertId/schedules')
  async createConcertSchedule(
    @Param('concertId', ParseIntPipe) concertId: number,
    @Body() request: CreateConcertScheduleRequest,
  ): Promise<ConcertScheduleResponse> {
    const schedule = await this.createConcertScheduleUseCase.execute(request.toUseCaseDTO(concertId));

    return ConcertScheduleResponse.from(schedule);
  }

  /**
   * 예약 가능한 콘서트 스케쥴 목록을 조회합니다.
   * @summary 예약 가능한 콘서트 스케쥴 목록 조회
   * @param concertId 콘서트 아이디
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserQueueAuthGuard)
  @Get(':concertId/schedules/bookable')
  async scanBookableSchedules(@Param('concertId', ParseIntPipe) concertId: number): Promise<ConcertScheduleResponse[]> {
    const bookableSchedules = await this.scanBookableScheduelsUseCase.execute(concertId);

    return bookableSchedules.map(concertSchedule => ConcertScheduleResponse.from(concertSchedule));
  }

  /**
   * 콘서트 스케쥴에 해당하는 좌석 목록을 조회합니다.
   * @summary 콘서트 스케쥴 좌석 목록 조회
   * @param concertScheduleId 콘서트 스케쥴 아이디
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserQueueAuthGuard)
  @Get('schedules/:concertScheduleId/seats')
  async scanConcertSeats(@Param('concertScheduleId', ParseIntPipe) concertScheduleId: number): Promise<ConcertSeatResponse[]> {
    const concertSeats = await this.scanConcertSeatsUseCase.execute(concertScheduleId);

    return concertSeats.map(concertSeat => ConcertSeatResponse.from(concertSeat));
  }

  /**
   * 콘서트 좌석을 예약합니다.
   * @summary 콘서트 좌석 예약
   * @param concertSeatId 콘서트 좌석 아이디
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserQueueAuthGuard)
  @Post('seats/:concertSeatId/book')
  async bookConcertSeat(
    @Param('concertSeatId', ParseIntPipe) concertSeatId: number,
    @Body() request: BookConcertSeatRequest,
    @TokenPayload<UserQueueTokenPayload>() payload: UserQueueTokenPayload,
  ): Promise<ConcertBookingResponse> {
    const concertBooking = await this.bookConcertSeatUseCase.execute(request.toUseCaseDTO(payload.userId, concertSeatId));

    return ConcertBookingResponse.from(concertBooking);
  }

  /**
   * 예약한 콘서트 좌석을 결제합니다.
   * @summary 예약 콘서트 좌석 결제
   * @param concertBookingId 콘서트 예약 아이디
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserQueueAuthGuard)
  @Post('bookings/:concertBookingId/pay')
  async payConcertBooking(
    @Param('concertBookingId', ParseIntPipe) concertBookingId: number,
    @Body() request: PayConcertBookingRequest,
    @TokenPayload<UserQueueTokenPayload>() payload: UserQueueTokenPayload,
  ): Promise<ConcertPaymentResponse> {
    const concertPayment = await this.payConcertBookingUseCase.execute(request.toUseCaseDTO(payload.userId, payload.userQueueId, concertBookingId));

    return ConcertPaymentResponse.from(concertPayment);
  }
}
