import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/domain/auth/decorator/auth.decorator';
import { UserTokenPayload } from 'src/domain/auth/interface/auth.interface';
import { UserAuthGuard } from 'src/domain/auth/guard/auth.guard';
import { ChargePointUseCase, ChargePointUseCaseSymbol } from 'src/domain/point/interface/use-case/charge-point.use-case';
import { ChargePointRequest } from 'src/presentation/point/dto/request/charge-point.request';
import { PointResponse } from 'src/presentation/point/dto/response/point.response';
import { ReadPointUseCase, ReadPointUseCaseSymbol } from 'src/domain/point/interface/use-case/read-point.use-case';

@ApiTags('포인트 관련 API')
@Controller('points')
export class PointController {
  constructor(
    @Inject(ChargePointUseCaseSymbol) private readonly chargePointUseCase: ChargePointUseCase,
    @Inject(ReadPointUseCaseSymbol) private readonly readPointUseCase: ReadPointUseCase,
  ) {}

  /**
   * 사용자의 포인트를 충전합니다.
   * @summary 포인트 충전
   * @returns
   */
  @Post('charge')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async chargePoint(@Body() request: ChargePointRequest, @TokenPayload<UserTokenPayload>() payload: UserTokenPayload): Promise<PointResponse> {
    const chargedPoint = await this.chargePointUseCase.execute(request.toUseCaseDTO(payload.userId));

    return PointResponse.from(chargedPoint);
  }

  /**
   * 사용자의 포인트를 조회합니다.
   * @summary 포인트 조회
   * @returns
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async readPoint(@TokenPayload<UserTokenPayload>() payload: UserTokenPayload): Promise<PointResponse> {
    const point = await this.readPointUseCase.execute(payload.userId);

    return PointResponse.from(point);
  }
}
