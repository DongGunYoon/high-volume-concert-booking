import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const TestTypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'root',
  password: 'password',
  database: 'high-volume-concert-booking-test',
  entities: [path.join(__dirname, '..', '..', '**', '*.entity{.ts,.js}')],
  synchronize: true,
  logging: false,
};
