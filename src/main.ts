import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const swaagerConfig = readFileSync(path.join(__dirname, '../../swagger.json'), 'utf8');
  SwaggerModule.setup('api-docs', app, JSON.parse(swaagerConfig));

  await app.listen(3000);
}

bootstrap();
