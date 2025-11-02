import Redis from "ioredis";

export class CacheClient {
  private redis: Redis;
  private ttl: number;

  constructor(redis: Redis, ttlSeconds: number = 60) {
    this.redis = redis;
    this.ttl = ttlSeconds;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), "EX", this.ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
