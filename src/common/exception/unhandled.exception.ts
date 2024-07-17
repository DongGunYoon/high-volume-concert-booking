import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';
import { ERROR_DETAILS } from '../constant/error-details';

export class UnhandledException extends HttpException {
  constructor() {
    const { message, statusCode } = ERROR_DETAILS[ErrorCode.INTERNAL_SERVER_ERROR];
    super(message, statusCode);
  }
}
