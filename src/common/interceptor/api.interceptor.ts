import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ApiResponse } from '../dto/api.response';

export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        response.status(200);

        return new ApiResponse(true, 200, null, data);
      }),
    );
  }
}
