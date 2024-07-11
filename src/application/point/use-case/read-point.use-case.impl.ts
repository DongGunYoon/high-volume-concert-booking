import { Injectable } from '@nestjs/common';
import { ReadPointUseCase } from 'src/domain/point/interface/use-case/read-point.use-case';
import { Point } from 'src/domain/point/model/point.domain';
import { PointService } from 'src/domain/point/service/point.service';

@Injectable()
export class ReadPointUseCaseImpl implements ReadPointUseCase {
  constructor(private readonly pointService: PointService) {}

  async execute(userId: number): Promise<Point> {
    return await this.pointService.read(userId);
  }
}
