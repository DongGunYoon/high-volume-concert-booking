import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../enum/error-code.enum';
import { ERROR_DETAILS } from '../constant/error-details';

export class CustomException extends HttpException {
  constructor(errorCode: ErrorCode) {
    const { message, statusCode } = ERROR_DETAILS[errorCode];
    super(message, statusCode);
  }
}
