import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Nullable } from 'src/common/type/native';

export const TokenPayload = createParamDecorator(<T>(_: unknown, context: ExecutionContext): T => {
  const request = context.switchToHttp().getRequest();
  const payload = request['user'] as Nullable<T>;

  if (!payload) {
    throw new UnauthorizedException();
  }

  return payload;
});
