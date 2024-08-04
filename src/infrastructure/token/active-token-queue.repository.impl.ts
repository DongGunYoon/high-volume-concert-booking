import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Nullable } from 'src/common/type/native';

@Injectable()
export class ActiveTokenQueueRepository {
  private readonly KEY_PREFIX = 'active_tokens';
  private readonly EXPIRE_SEC = 60 * 5;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add(key: string, value: string): Promise<void> {
    await this.redis.set(`${this.KEY_PREFIX}:${key}`, value, 'EX', this.EXPIRE_SEC, 'NX');
  }

  async findOne(key: string): Promise<Nullable<string>> {
    return await this.redis.get(`${this.KEY_PREFIX}:${key}`);
  }

  async remove(key: string): Promise<number> {
    return await this.redis.del(`${this.KEY_PREFIX}:${key}`);
  }
}
