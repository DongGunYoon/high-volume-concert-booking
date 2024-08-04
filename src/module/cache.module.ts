import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          port: configService.get('REDIS_PORT'),
          host: configService.get('REDIS_HOST'),
        });
        return { store };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class RedisCacheModule {}
