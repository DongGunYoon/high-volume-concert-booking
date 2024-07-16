import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../dto/api.response';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let apiResponse: ApiResponse<null>;
    let httpStatusCode: HttpStatus;

    if (exception instanceof HttpException) {
      apiResponse = new ApiResponse(false, exception.getStatus(), exception.message, null);
      httpStatusCode = HttpStatus.OK;
    } else {
      apiResponse = new ApiResponse(false, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', null);
      httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(httpStatusCode).json(apiResponse);
  }
}
