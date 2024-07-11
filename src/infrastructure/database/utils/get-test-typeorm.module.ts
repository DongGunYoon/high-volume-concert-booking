import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

export function getPgTestTypeOrmModule() {
  const rootDir = path.resolve(__dirname, '../../..');

  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'root',
    password: 'password',
    database: 'high-volume-concert-booking-test',
    entities: [path.join(rootDir, '**', '*.entity.{ts,js}')],
    synchronize: true,
  });
}
