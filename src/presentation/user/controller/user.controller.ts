import { Controller, Post } from '@nestjs/common';
import { UserQueueResponse } from '../dto/response/user-queue.response';

@Controller('users')
export class UserController {
  @Post('queue')
  async issueUserQueue(): Promise<UserQueueResponse> {
    return new UserQueueResponse(1, 1, 0, 'token-example', new Date(Date.now() + 5 * 60 * 1000));
  }
}
