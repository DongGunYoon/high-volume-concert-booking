import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../dto/api.response';
import { UnhandledException } from '../exception/unhandled.exception';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let httpStatusCode: HttpStatus;

    if (exception instanceof HttpException) {
      httpStatusCode = HttpStatus.OK;
    } else {
      exception = new UnhandledException();
      httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const apiResponse = new ApiResponse(false, exception.getStatus(), exception.message, null);

    response.status(httpStatusCode).json(apiResponse);
  }
}
