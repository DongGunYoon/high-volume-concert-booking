import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ConcertScheduleResponse } from '../dto/response/concert-schedule.response';
import { ConcertSeatResponse } from '../dto/response/concert-seat.response';
import { ConcertBookingResponse } from '../dto/response/concert-booking.response';
import { ConcertPaymentHistoryResponse } from '../dto/response/concert-payment-history.response';

@Controller('concerts')
export class ConcertController {
  @Get(':concertId/schedules/bookable')
  async scanBookableSchedules(@Param('concertId', ParseIntPipe) concertId: number): Promise<ConcertScheduleResponse[]> {
    return [new ConcertScheduleResponse(1, concertId, new Date(), new Date(), new Date(), new Date(), '최고의 콘서트')];
  }

  @Get('schedules/:concertScheduleId/seats')
  async scanConcertSeats(@Param('concertScheduleId', ParseIntPipe) concertScheduleId: number): Promise<ConcertSeatResponse[]> {
    return [
      new ConcertSeatResponse(1, concertScheduleId, 10000, 1, 'PURCHASED'),
      new ConcertSeatResponse(2, concertScheduleId, 20000, 2, 'RESERVED'),
      new ConcertSeatResponse(3, concertScheduleId, 10000, 3, 'AVAILABLE'),
    ];
  }

  @Post('seats/:concertSeatId/book')
  async bookConcertSeat(@Param('concertSeatId', ParseIntPipe) concertSeatId: number): Promise<ConcertBookingResponse> {
    return new ConcertBookingResponse(1, concertSeatId, 'PENDING', new Date(Date.now() + 60 * 1000 * 5));
  }

  @Post('bookings/:concertBookingId/pay')
  async payConcertBooking(@Param('concertBookingId', ParseIntPipe) concertBookingId: number): Promise<ConcertPaymentHistoryResponse> {
    return new ConcertPaymentHistoryResponse(1, '최고의 콘서트', 10000, 'BUY');
  }
}
