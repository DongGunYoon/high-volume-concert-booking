import { RedisModuleAsyncOptions } from '@nestjs-modules/ioredis';

export const TestRedisConfig: RedisModuleAsyncOptions = {
  useFactory: () => ({
    type: 'single',
    url: process.env.TEST_REDIS_URL,
  }),
};
