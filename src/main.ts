import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { ApiResponseInterceptor } from './common/interceptor/api.interceptor';
import { ApiExceptionFilter } from './common/filter/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const swaagerConfig = readFileSync(path.join(__dirname, '../../swagger.json'), 'utf8');
  SwaggerModule.setup('api-docs', app, JSON.parse(swaagerConfig));

  await app.listen(3000);
}

bootstrap();
