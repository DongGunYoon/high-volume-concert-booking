import { ChargePointUseCase } from 'src/domain/point/interface/use-case/charge-point.use-case';
import { Point } from 'src/domain/point/model/point.domain';
import { PointService } from 'src/domain/point/service/point.service';
import { DataSource } from 'typeorm';
import { ChargePointUseCaseDTO } from '../dto/charge-point.use-case.dto';
import { PessimisticLockMode } from 'src/common/enum/database.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChargePointUseCaseImpl implements ChargePointUseCase {
  constructor(
    private readonly pointService: PointService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: ChargePointUseCaseDTO): Promise<Point> {
    return await this.dataSource.transaction(async transactionManager => {
      return await this.pointService.charge(dto.toChargePointDTO(), transactionManager, { mode: PessimisticLockMode.PESSIMISTIC_WRTIE });
    });
  }
}
