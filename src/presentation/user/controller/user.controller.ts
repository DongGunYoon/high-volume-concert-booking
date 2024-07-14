import { EnqueueUserQueueUseCase } from '../../../domain/user/interface/use-case/enqueue-user-queue.use-case';
import { Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { UserQueueResponse } from '../dto/response/user-queue.response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/domain/auth/guard/auth.guard';
import { EnqueueUserQueueUseCaseSymbol } from 'src/domain/user/interface/use-case/enqueue-user-queue.use-case';
import { TokenPayload } from 'src/domain/auth/decorator/auth.decorator';
import { UserTokenPayload } from 'src/domain/auth/interface/auth.interface';

@ApiTags('유저(대기열) 관련 API')
@Controller('users')
export class UserController {
  constructor(@Inject(EnqueueUserQueueUseCaseSymbol) private readonly enqueueUserQueueUseCase: EnqueueUserQueueUseCase) {}

  /**
   * 유저 대기열에 입장합니다.
   * @summary 유저 대기열 입장
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  @Post('queue')
  async enqueueUserQueue(@TokenPayload<UserTokenPayload>() payload: UserTokenPayload): Promise<UserQueueResponse> {
    const queue = await this.enqueueUserQueueUseCase.execute(payload.userId);

    return UserQueueResponse.from(queue);
  }
}
