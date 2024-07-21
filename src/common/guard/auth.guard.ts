import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';
import { CustomException } from '../exception/custom.exception';
import { ErrorCode } from '../enum/error-code.enum';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new CustomException(ErrorCode.TOKEN_NOT_PROVIDED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_USER_SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }

    return true;
  }
}

@Injectable()
export class UserQueueAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userQueueService: UserQueueService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new CustomException(ErrorCode.TOKEN_NOT_PROVIDED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_USER_QUEUE_SECRET,
      });

      const userQueue = await this.userQueueService.getByIdOrThrow(payload.userQueueId);

      if (userQueue.expiresAt! < new Date()) {
        throw new CustomException(ErrorCode.TOKEN_EXPIRED);
      }

      request['user'] = payload;
    } catch {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }
    return true;
  }
}

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
