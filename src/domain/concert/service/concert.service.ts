import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConcertSchedule } from '../model/concert-schedule.domain';
import { ConcertScheduleRepository, ConcertScheduleRepositorySymbol } from '../interface/repository/concert-schedule.repository';
import { ConcertRepository, ConcertRepositorySymbol } from '../interface/repository/concert.repository';
import { ConcertSeatRepository, ConcertSeatRepositorySymbol } from '../interface/repository/concert-seat.repository';
import { ConcertSeat } from '../model/concert-seat.domain';
import { CustomLock } from 'src/common/interface/database.interface';
import { EntityManager } from 'typeorm';
import { CreateConcertBookingDTO } from '../dto/create-concert-booking.dto';
import { ConcertBooking } from '../model/concert-booking.domain';
import { ConcertBookingRepository, ConcertBookingRepositorySymbol } from '../interface/repository/concert-booking.repository';
import { PayConcertBookingDTO } from '../dto/pay-concert-booking.dto';

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertRepositorySymbol) private readonly concertRepository: ConcertRepository,
    @Inject(ConcertScheduleRepositorySymbol) private readonly concertScheduleRepository: ConcertScheduleRepository,
    @Inject(ConcertSeatRepositorySymbol) private readonly concertSeatRepository: ConcertSeatRepository,
    @Inject(ConcertBookingRepositorySymbol) private readonly concertBookingRepository: ConcertBookingRepository,
  ) {}

  async scanBookableSchedueles(concertId: number): Promise<ConcertSchedule[]> {
    const concertExists = await this.concertRepository.existsById(concertId);

    if (!concertExists) {
      throw new NotFoundException(`콘서트가 존재하지 않습니다.`);
    }

    return await this.concertScheduleRepository.findAllBookableByConcertId(concertId);
  }

  async scanSeats(concertScheduleId: number): Promise<ConcertSeat[]> {
    const concertScheduleExists = await this.concertScheduleRepository.existsById(concertScheduleId);

    if (!concertScheduleExists) {
      throw new NotFoundException('콘서트 스케쥴이 존재하지 않습니다.');
    }

    return await this.concertSeatRepository.findAllByConcertScheduleId(concertScheduleId);
  }

  async bookSeat(concertSeatId: number, entityManager: EntityManager, lock: CustomLock): Promise<ConcertSeat> {
    const concertSeat = await this.concertSeatRepository.findOneById(concertSeatId, entityManager, lock);

    if (!concertSeat) {
      throw new NotFoundException('콘서트 좌석이 존재하지 않습니다.');
    }

    concertSeat.book();

    return await this.concertSeatRepository.save(concertSeat, entityManager);
  }

  async createBooking(dto: CreateConcertBookingDTO, entityManager: EntityManager): Promise<ConcertBooking> {
    const concertBooking = ConcertBooking.create(dto);

    return await this.concertBookingRepository.save(concertBooking, entityManager);
  }

  async paySeat(seatId: number, entityManager: EntityManager, lock: CustomLock): Promise<ConcertSeat> {
    const concertSeat = await this.concertSeatRepository.findOneById(seatId, entityManager, lock);

    if (!concertSeat) {
      throw new NotFoundException('콘서트 좌석이 존재하지 않습니다.');
    }

    concertSeat.pay();

    return await this.concertSeatRepository.save(concertSeat, entityManager);
  }

  async payBooking(dto: PayConcertBookingDTO, entityManager: EntityManager, lock: CustomLock): Promise<ConcertBooking> {
    const concertBooking = await this.concertBookingRepository.findOneById(dto.concertBookingId, entityManager, lock);

    if (!concertBooking) {
      throw new NotFoundException('콘서트 예약이 존재하지 않습니다.');
    }

    concertBooking.pay(dto.userId);

    return await this.concertBookingRepository.save(concertBooking, entityManager);
  }

  async validateScheduleIsBookable(concertScheduleId: number): Promise<void> {
    const concertSchedule = await this.concertScheduleRepository.findOneById(concertScheduleId);

    if (!concertSchedule) {
      throw new NotFoundException('콘서트 스케쥴이 존재하지 않습니다.');
    }

    concertSchedule.validateBookable();
  }
}
