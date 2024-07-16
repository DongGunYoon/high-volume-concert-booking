// test-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from 'src/common/type/native';
import { ConcertBooking } from 'src/domain/concert/model/concert-booking.domain';
import { ConcertPayment } from 'src/domain/concert/model/concert-payment.domain';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { PointHistory } from 'src/domain/point/model/point-history.domain';
import { UserQueue } from 'src/domain/user/model/user-queue.domain';
import { User } from 'src/domain/user/model/user.domain';
import { ConcertBookingEntity } from 'src/infrastructure/concert/entity/concert-booking.entity';
import { ConcertPaymentEntity } from 'src/infrastructure/concert/entity/concert-payment.entity';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertBookingMapper } from 'src/infrastructure/concert/mapper/concert-booking.mapper';
import { ConcertPaymentMapper } from 'src/infrastructure/concert/mapper/concert-payment.mapper';
import { ConcertScheduleMapper } from 'src/infrastructure/concert/mapper/concert-schedule.mapper';
import { ConcertSeatMapper } from 'src/infrastructure/concert/mapper/concert-seat.mapper';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { PointHistoryEntity } from 'src/infrastructure/point/entity/point-history.entity';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';
import { PointHistoryMapper } from 'src/infrastructure/point/mapper/point-history.mapper';
import { UserQueueEntity } from 'src/infrastructure/user/entity/user-queue.entity';
import { UserEntity } from 'src/infrastructure/user/entity/user.entity';
import { UserQueueMapper } from 'src/infrastructure/user/mapper/user-queue.mapper';
import { UserMapper } from 'src/infrastructure/user/mapper/user.mapper';
import { Repository } from 'typeorm';

@Injectable()
export class TestDataService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserQueueEntity)
    private queueRepository: Repository<UserQueueEntity>,
    @InjectRepository(PointEntity)
    private pointRepository: Repository<PointEntity>,
    @InjectRepository(PointHistoryEntity)
    private pointHistoryRepository: Repository<PointHistoryEntity>,
    @InjectRepository(ConcertEntity)
    private concertRepository: Repository<ConcertEntity>,
    @InjectRepository(ConcertScheduleEntity)
    private scheduleRepository: Repository<ConcertScheduleEntity>,
    @InjectRepository(ConcertSeatEntity)
    private seatRepository: Repository<ConcertSeatEntity>,
    @InjectRepository(ConcertBookingEntity)
    private bookingRepository: Repository<ConcertBookingEntity>,
    @InjectRepository(ConcertPaymentEntity)
    private paymentRepository: Repository<ConcertPaymentEntity>,
  ) {}

  createUser = async (name: string): Promise<User> => {
    const user = UserMapper.toEntity(User.create(name));

    return UserMapper.toDomain(await this.userRepository.save(user));
  };

  createPendingUserQueue = async (userId: number): Promise<UserQueue> => {
    const userQueue = UserQueueMapper.toEntity(new UserQueue(0, userId, null, null));

    return UserQueueMapper.toDomain(await this.queueRepository.save(userQueue));
  };

  createTokenIssuedUserQueue = async (userId: number): Promise<UserQueue> => {
    const userQueue = await this.createPendingUserQueue(userId);

    userQueue.activate();

    const userQueueEntity = UserQueueMapper.toEntity(userQueue);

    return UserQueueMapper.toDomain(await this.queueRepository.save(userQueueEntity));
  };

  getPointHistory = async (userId: number): Promise<PointHistory> => {
    const pointHistory = await this.pointHistoryRepository.findOneBy({ userId });

    return PointHistoryMapper.toDomain(pointHistory!);
  };

  setPoint = async (userId: number, amount: number): Promise<void> => {
    await this.pointRepository.update({ userId }, { amount });
  };

  createConcert = async (title: string): Promise<Concert> => {
    const concert = ConcertMapper.toEntity(new Concert(0, title, null));

    return ConcertMapper.toDomain(await this.concertRepository.save(concert));
  };

  createSchedule = async (concertId: number, bookingStartAt: Date, bookingEndAt: Date): Promise<ConcertSchedule> => {
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concertId, bookingStartAt, bookingEndAt, bookingEndAt, bookingEndAt));

    return ConcertScheduleMapper.toDomain(await this.scheduleRepository.save(concertSchedule));
  };

  createBookableSchedule = async (concertId: number): Promise<ConcertSchedule> => {
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = new Date(Date.now() + 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concertId, pastDate, futureDate, futureDate, futureDate));

    return ConcertScheduleMapper.toDomain(await this.scheduleRepository.save(concertSchedule));
  };

  createNonBookableSchedule = async (concertId: number): Promise<ConcertSchedule> => {
    const pastDate = new Date(Date.now() - 10000);
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concertId, pastDate, pastDate, pastDate, pastDate));

    return ConcertScheduleMapper.toDomain(await this.scheduleRepository.save(concertSchedule));
  };

  createSeat = async (
    concertId: number,
    concertScheduleId: number,
    price: number = 1000,
    isPaid: boolean = false,
    reservedUntil: Nullable<Date> = null,
  ): Promise<ConcertSeat> => {
    const concertSeat = ConcertSeatMapper.toEntity(new ConcertSeat(0, concertId, concertScheduleId, price, 1, isPaid, reservedUntil));

    return ConcertSeatMapper.toDomain(await this.seatRepository.save(concertSeat));
  };

  getSeat = async (id: number): Promise<ConcertSeat> => {
    const concertSeat = await this.seatRepository.findOneBy({ id });

    return ConcertSeatMapper.toDomain(concertSeat!);
  };

  createBooking = async (seat: ConcertSeat, userId: number, expiresAt: Date, isPaid: boolean = false): Promise<ConcertBooking> => {
    const concertBooking = ConcertBookingMapper.toEntity(
      new ConcertBooking(0, userId, seat.concertId, seat.concertScheduleId, seat.id, seat.price, isPaid, expiresAt),
    );

    return ConcertBookingMapper.toDomain(await this.bookingRepository.save(concertBooking));
  };

  getBooking = async (seatId: number): Promise<ConcertBooking> => {
    const concertBooking = await this.bookingRepository.findOneBy({ concertSeatId: seatId });

    return ConcertBookingMapper.toDomain(concertBooking!);
  };

  getPayment = async (bookingId: number): Promise<ConcertPayment> => {
    const payment = await this.paymentRepository.findOneBy({ concertBookingId: bookingId });

    return ConcertPaymentMapper.toDomain(payment!);
  };

  cleanUpTestData = async (): Promise<void> => {
    await this.userRepository.delete({});
    await this.queueRepository.delete({});
    await this.pointRepository.delete({});
    await this.pointHistoryRepository.delete({});
    await this.concertRepository.delete({});
    await this.scheduleRepository.delete({});
    await this.seatRepository.delete({});
    await this.bookingRepository.delete({});
    await this.paymentRepository.delete({});
  };
}
