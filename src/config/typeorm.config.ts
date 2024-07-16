import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const TypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'high-volume-concert-booking',
  entities: [path.join(__dirname, '..', '..', '**', '*.entity{.ts,.js}')],
  synchronize: true,
  logging: false,
};
