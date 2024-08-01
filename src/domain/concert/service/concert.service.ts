import { Inject, Injectable } from '@nestjs/common';
import { ConcertSchedule } from '../model/concert-schedule.domain';
import { ConcertScheduleRepository, ConcertScheduleRepositorySymbol } from '../interface/repository/concert-schedule.repository';
import { ConcertRepository, ConcertRepositorySymbol } from '../interface/repository/concert.repository';
import { ConcertSeatRepository, ConcertSeatRepositorySymbol } from '../interface/repository/concert-seat.repository';
import { ConcertSeat } from '../model/concert-seat.domain';
import { EntityManager } from 'typeorm';
import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';
import { ConcertBooking } from '../model/concert-booking.domain';
import { ConcertBookingRepository, ConcertBookingRepositorySymbol } from '../interface/repository/concert-booking.repository';
import { PayConcertBookingDTO } from '../dto/pay-concert-booking.dto';
import { Concert } from '../model/concert.domain';
import { CustomException } from 'src/common/exception/custom.exception';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { CreateConcertDTO } from '../dto/create-concert.dto';

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertRepositorySymbol) private readonly concertRepository: ConcertRepository,
    @Inject(ConcertScheduleRepositorySymbol) private readonly concertScheduleRepository: ConcertScheduleRepository,
    @Inject(ConcertSeatRepositorySymbol) private readonly concertSeatRepository: ConcertSeatRepository,
    @Inject(ConcertBookingRepositorySymbol) private readonly concertBookingRepository: ConcertBookingRepository,
  ) {}

  async create(dto: CreateConcertDTO): Promise<Concert> {
    const concert = Concert.create(dto);

    return await this.concertRepository.save(concert);
  }

  async scanConcerts(): Promise<Concert[]> {
    return await this.concertRepository.findAll();
  }

  async scanBookableSchedueles(concertId: number): Promise<ConcertSchedule[]> {
    const concertExists = await this.concertRepository.existsById(concertId);

    if (!concertExists) {
      throw new CustomException(ErrorCode.CONCERT_NOT_FOUND);
    }

    return await this.concertScheduleRepository.findAllBookableByConcertId(concertId);
  }

  async scanSeats(concertScheduleId: number): Promise<ConcertSeat[]> {
    const concertScheduleExists = await this.concertScheduleRepository.existsById(concertScheduleId);

    if (!concertScheduleExists) {
      throw new CustomException(ErrorCode.SCHEDULE_NOT_FOUND);
    }

    return await this.concertSeatRepository.findAllByConcertScheduleId(concertScheduleId);
  }

  async bookSeat(concertSeatId: number, entityManager: EntityManager): Promise<ConcertSeat> {
    const concertSeat = await this.concertSeatRepository.findOneById(concertSeatId, entityManager);

    if (!concertSeat) {
      throw new CustomException(ErrorCode.SEAT_NOT_FOUND);
    }

    concertSeat.book();

    const updated = await this.concertSeatRepository.update(concertSeat, entityManager);

    if (!updated) {
      throw new CustomException(ErrorCode.OPTIMISTIC_LOCK_CONFLICT);
    }

    return concertSeat;
  }

  async createBooking(dto: CreateConcertBookingDTO, entityManager: EntityManager): Promise<ConcertBooking> {
    const concertBooking = ConcertBooking.create(dto);

    return await this.concertBookingRepository.save(concertBooking, entityManager);
  }

  async paySeat(seatId: number, entityManager: EntityManager): Promise<ConcertSeat> {
    const concertSeat = await this.concertSeatRepository.findOneById(seatId, entityManager);

    if (!concertSeat) {
      throw new CustomException(ErrorCode.SEAT_NOT_FOUND);
    }

    concertSeat.pay();

    const updated = await this.concertSeatRepository.update(concertSeat, entityManager);

    if (!updated) {
      throw new CustomException(ErrorCode.OPTIMISTIC_LOCK_CONFLICT);
    }

    return concertSeat;
  }

  async payBooking(dto: PayConcertBookingDTO, entityManager: EntityManager): Promise<ConcertBooking> {
    const concertBooking = await this.concertBookingRepository.findOneById(dto.concertBookingId, entityManager);

    if (!concertBooking) {
      throw new CustomException(ErrorCode.BOOKING_NOT_FOUND);
    }

    concertBooking.pay(dto.userId);

    const updated = await this.concertBookingRepository.update(concertBooking, entityManager);

    if (!updated) {
      throw new CustomException(ErrorCode.OPTIMISTIC_LOCK_CONFLICT);
    }

    return concertBooking;
  }

  async validateScheduleIsBookable(concertScheduleId: number): Promise<void> {
    const concertSchedule = await this.concertScheduleRepository.findOneById(concertScheduleId);

    if (!concertSchedule) {
      throw new CustomException(ErrorCode.SCHEDULE_NOT_FOUND);
    }

    concertSchedule.validateBookable();
  }
}
