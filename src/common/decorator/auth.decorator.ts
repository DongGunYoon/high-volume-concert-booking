import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Nullable } from 'src/common/type/native';
import { CustomException } from '../exception/custom.exception';
import { ErrorCode } from '../enum/error-code.enum';

export const TokenPayload = createParamDecorator(<T>(_: unknown, context: ExecutionContext): T => {
  const request = context.switchToHttp().getRequest();
  const payload = request['user'] as Nullable<T>;

  if (!payload) {
    throw new CustomException(ErrorCode.TOKEN_NOT_PROVIDED);
  }

  return payload;
});
