import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChargePointRequest } from '../dto/request/charge-point.request';
import { PointResponse } from '../dto/response/point.response';

@Controller('points')
export class PointController {
  @Post('charge')
  async chargePoint(@Body() request: ChargePointRequest): Promise<PointResponse> {
    return new PointResponse(1, 1, request.amount);
  }

  @Get()
  async readPoint(): Promise<PointResponse> {
    return new PointResponse(1, 1, 1004);
  }
}
