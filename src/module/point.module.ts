import { Module } from '@nestjs/common';
import { ChargePointUseCaseImpl } from 'src/application/point/use-case/charge-point.use-case.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointEntity } from 'src/infrastructure/point/entity/point.entity';
import { ChargePointUseCaseSymbol } from 'src/domain/point/interface/use-case/charge-point.use-case';
import { PointRepositorySymbol } from 'src/domain/point/interface/repository/point.repository';
import { PointRepositoryImpl } from 'src/infrastructure/point/repository/point.repository.impl';
import { PointHistoryRepositorySymbol } from 'src/domain/point/interface/repository/point-history.repository';
import { PointHistoryRepositoryImpl } from 'src/infrastructure/point/repository/point-history.repository.impl';
import { PointHistoryEntity } from 'src/infrastructure/point/entity/point-history.entity';
import { ReadPointUseCaseSymbol } from 'src/domain/point/interface/use-case/read-point.use-case';
import { ReadPointUseCaseImpl } from 'src/application/point/use-case/read-point.use-case.impl';
import { PointService } from 'src/domain/point/service/point.service';
import { PointController } from 'src/interface/presentation/point/controller/point.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PointEntity, PointHistoryEntity])],
  controllers: [PointController],
  providers: [
    PointService,
    { provide: ChargePointUseCaseSymbol, useClass: ChargePointUseCaseImpl },
    { provide: ReadPointUseCaseSymbol, useClass: ReadPointUseCaseImpl },
    { provide: PointRepositorySymbol, useClass: PointRepositoryImpl },
    { provide: PointHistoryRepositorySymbol, useClass: PointHistoryRepositoryImpl },
  ],
  exports: [PointService],
})
export class PointModule {}
