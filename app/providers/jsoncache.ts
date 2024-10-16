import fs from "node:fs";
import path from "node:path";
import type { CacheProvider } from "@/types/cacheProvider";

export class JSONCacheProvider implements CacheProvider {
  private cacheFilePath = path.resolve("cache.json");
  private cache: Record<string, any>;
  private ttl: number = 60 * 1000; // Cache TTL in milliseconds

  constructor() {
    this.cache = this.loadCacheFromFile();
  }

  private loadCacheFromFile(): Record<string, any> {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const data = fs.readFileSync(this.cacheFilePath, "utf-8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Failed to load cache file:", err);
    }
    return {};
  }

  private saveCacheToFile() {
    try {
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache), "utf-8");
    } catch (err) {
      console.error("Failed to save cache file:", err);
    }
  }

  async get(key: string): Promise<any | null> {
    const currentTime = Date.now();
    const cachedEntry = this.cache[key];
    if (cachedEntry && currentTime - cachedEntry.timestamp < this.ttl) {
      return cachedEntry.result;
    }
    return null;
  }

  async set(key: string, value: any): Promise<void> {
    const currentTime = Date.now();
    this.cache[key] = {
      timestamp: currentTime,
      result: value,
    };
    this.saveCacheToFile();
  }
}
