import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, tap } from 'rxjs';
import { ApiResponse } from '../dto/api.response';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => this.logger.info(`Success: ${method} ${url}`)),
      map(data => {
        const response = context.switchToHttp().getResponse();
        response.status(200);

        return new ApiResponse(true, 200, null, data);
      }),
    );
  }
}
