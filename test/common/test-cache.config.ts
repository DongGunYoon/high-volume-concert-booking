import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoreConfig } from 'cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

export const TestCacheConfig: CacheModuleAsyncOptions<StoreConfig> = {
  imports: [ConfigModule],
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      port: configService.get('TEST_REDIS_PORT'),
      host: configService.get('TEST_REDIS_HOST'),
    });
    return { store };
  },
};
