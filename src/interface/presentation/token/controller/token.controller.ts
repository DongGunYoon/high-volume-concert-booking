import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnqueueTokenQueueUseCase } from 'src/application/token/enqueue-token-queue.use-case.impl';
import { TokenPayload } from 'src/common/decorator/auth.decorator';
import { UserAuthGuard } from 'src/common/guard/auth.guard';
import { UserTokenPayload } from 'src/common/interface/auth.interface';
import { TokenQueueResponse } from '../dto/token-queue.response';
import { ScanTokenQueueUseCase } from 'src/application/token/scan-token-queue.use-case.impl';

@ApiTags('대기열 토큰 API')
@Controller('token')
export class TokenController {
  constructor(
    private readonly enqueueTokenQueueUseCase: EnqueueTokenQueueUseCase,
    private readonly scanTokenQueueUseCase: ScanTokenQueueUseCase,
  ) {}

  /**
   * 토큰 대기열에 입장합니다.
   * @summary 토큰 대기열 입장
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post()
  async enqueueTokenQueue(@TokenPayload<UserTokenPayload>() payload: UserTokenPayload): Promise<TokenQueueResponse> {
    const queue = await this.enqueueTokenQueueUseCase.execute(payload.userId);

    return TokenQueueResponse.from(queue);
  }

  /**
   * 토큰 대기열을 조회합니다.
   * @summary 토큰 대기열 조회
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Get()
  async scanTokenQueue(@TokenPayload<UserTokenPayload>() payload: UserTokenPayload): Promise<TokenQueueResponse> {
    const queue = await this.scanTokenQueueUseCase.execute(payload.userId);

    return TokenQueueResponse.from(queue);
  }
}
