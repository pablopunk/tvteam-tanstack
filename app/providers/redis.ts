import Redis from "ioredis";
import type { CacheProvider } from "@/types/cacheProvider";

export class RedisCacheProvider implements CacheProvider {
  private client: Redis;
  private ttl = 60; // Cache TTL in seconds

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
  }

  async get(key: string): Promise<any | null> {
    try {
      const cachedResult = await this.client.get(key);
      if (cachedResult) {
        console.log(`*Serving from Redis cache [${key}]`);
        return JSON.parse(cachedResult);
      }
    } catch (err) {
      console.error("Redis get error:", err);
    }
    return null;
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.client.setex(key, this.ttl, JSON.stringify(value));
    } catch (err) {
      console.error("Redis set error:", err);
    }
  }
}
