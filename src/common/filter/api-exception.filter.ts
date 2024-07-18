import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../dto/api.response';
import { UnhandledException } from '../exception/unhandled.exception';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let httpStatusCode: HttpStatus;

    if (exception instanceof HttpException) {
      this.logger.warn(`HttpException: ${exception.message}`, {
        statusCode: exception.getStatus(),
        path: request.url,
        method: request.method,
      });

      httpStatusCode = HttpStatus.OK;
    } else {
      const unhandledException = new UnhandledException();

      this.logger.error(`UnhandledException: ${unhandledException.message}`, exception instanceof Error ? exception.stack : 'No stack trace available', {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: request.url,
        method: request.method,
      });

      exception = unhandledException;
      httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const apiResponse = new ApiResponse(false, exception.getStatus(), exception.message, null);

    response.status(httpStatusCode).json(apiResponse);
  }
}
