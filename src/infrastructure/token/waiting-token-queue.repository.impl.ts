import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Nullable } from 'src/common/type/native';

@Injectable()
export class WaitingTokenQueueRepository {
  private readonly WAITING_TOKENS_KEY = 'waiting_tokens';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add(member: string): Promise<number> {
    return this.redis.zadd(this.WAITING_TOKENS_KEY, 'NX', Date.now(), member);
  }

  async getOrder(member: string): Promise<Nullable<number>> {
    const rankIdx = await this.redis.zrank(this.WAITING_TOKENS_KEY, member);

    if (rankIdx == null) return null;

    return rankIdx + 1;
  }

  async getSize(): Promise<number> {
    return this.redis.zcard(this.WAITING_TOKENS_KEY);
  }

  async findOldest(count: number): Promise<string[]> {
    return this.redis.zrange(this.WAITING_TOKENS_KEY, 0, count - 1);
  }

  async remove(members: string[]): Promise<number> {
    return this.redis.zrem(this.WAITING_TOKENS_KEY, ...members);
  }
}
