import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserQueueService } from 'src/domain/user/service/user-queue.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_USER_SECRET,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
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
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_USER_QUEUE_SECRET,
      });

      const userQueue = await this.userQueueService.getByIdOrThrow(payload.userQueueId);

      if (userQueue.expiresAt! < new Date()) {
        throw new UnauthorizedException('이미 만료된 토큰입니다.');
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
