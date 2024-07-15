import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ScanConcertSeatsUseCase, ScanConcertSeatsUseCaseSymbol } from 'src/domain/concert/interface/use-case/scan-concert-seats.use-case';
import { ConcertSchedule } from 'src/domain/concert/model/concert-schedule.domain';
import { ConcertSeat } from 'src/domain/concert/model/concert-seat.domain';
import { Concert } from 'src/domain/concert/model/concert.domain';
import { ConcertScheduleEntity } from 'src/infrastructure/concert/entity/concert-schedule.entity';
import { ConcertSeatEntity } from 'src/infrastructure/concert/entity/concert-seat.entity';
import { ConcertEntity } from 'src/infrastructure/concert/entity/concert.entity';
import { ConcertScheduleMapper } from 'src/infrastructure/concert/mapper/concert-schedule.mapper';
import { ConcertSeatMapper } from 'src/infrastructure/concert/mapper/concert-seat.mapper';
import { ConcertMapper } from 'src/infrastructure/concert/mapper/concert.mapper';
import { TestTypeORMConfig } from 'src/infrastructure/database/config/test-typeorm.config';
import { AuthModule } from 'src/module/auth.module';
import { ConcertModule } from 'src/module/concert.module';
import { Repository } from 'typeorm';

describe('ScanConcertSeatsUseCase', () => {
  let module: TestingModule;
  let scanConcertSeatsUseCase: ScanConcertSeatsUseCase;
  let concertRepository: Repository<ConcertEntity>;
  let concertScheduleRepository: Repository<ConcertScheduleEntity>;
  let concertSeatRepository: Repository<ConcertSeatEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestTypeORMConfig), ConcertModule, AuthModule],
    }).compile();

    scanConcertSeatsUseCase = module.get<ScanConcertSeatsUseCase>(ScanConcertSeatsUseCaseSymbol);
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
    concertScheduleRepository = module.get(getRepositoryToken(ConcertScheduleEntity));
    concertSeatRepository = module.get(getRepositoryToken(ConcertSeatEntity));
  });

  afterAll(async () => {
    await module.close();
  });

  describe('콘서트 좌석 목록 조회 성공', () => {
    it('콘서트 좌석이 없다면 빈 배열이 조회됩니다.', async () => {
      // Given
      const concertSchedule = await createSchedule();

      // When
      const seats = await scanConcertSeatsUseCase.execute(concertSchedule.id);

      // Then
      expect(seats).toHaveLength(0);
    });

    it('콘서트 좌석이 있다면 해당하는 좌석들이 조회됩니다.', async () => {
      // Given
      const concertSchedule = await createSchedule();
      await Promise.all(Array.from({ length: 5 }, () => createSeat(concertSchedule.concertId, concertSchedule.id)));

      // When
      const seats = await scanConcertSeatsUseCase.execute(concertSchedule.id);

      // Then
      expect(seats).toHaveLength(5);
      expect(seats[0].concertId).toBe(concertSchedule.concertId);
      expect(seats[0].concertScheduleId).toBe(concertSchedule.id);
    });
  });

  describe('콘서트 좌석 목록 조회 실패', () => {
    it('입력된 콘서트 스케쥴이 존재하지 않으면, 에러가 발생합니다.', async () => {
      // Given
      const concertScheduleId = -1;

      // When
      const exectue = async () => scanConcertSeatsUseCase.execute(concertScheduleId);

      // Then
      await expect(exectue).rejects.toThrow('콘서트 스케쥴이 존재하지 않습니다.');
    });
  });

  const createSchedule = async (): Promise<ConcertSchedule> => {
    const concert = await concertRepository.save(ConcertMapper.toEntity(new Concert(0, '콘서트', null)));
    const concertSchedule = ConcertScheduleMapper.toEntity(new ConcertSchedule(0, concert.id, new Date(), new Date(), new Date(), new Date()));

    return ConcertScheduleMapper.toDomain(await concertScheduleRepository.save(concertSchedule));
  };

  const createSeat = async (concertId: number, concertSeatId: number): Promise<ConcertSeat> => {
    const concertSeat = ConcertSeatMapper.toEntity(new ConcertSeat(0, concertId, concertSeatId, 10000, 1, false, null));

    return ConcertSeatMapper.toDomain(await concertSeatRepository.save(concertSeat));
  };
});
