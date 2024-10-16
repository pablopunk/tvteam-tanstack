import { getMatches } from "@/providers/livesoccertv";
import type { CacheProvider } from "@/types/cacheProvider";
import { RedisCacheProvider } from "@/providers/redis";
import { JSONCacheProvider } from "@/providers/jsoncache";

let cacheProvider: CacheProvider;

// Determine which cache provider to use
if (process.env.REDIS_URL) {
  cacheProvider = new RedisCacheProvider(process.env.REDIS_URL);
} else {
  cacheProvider = new JSONCacheProvider();
}

interface CacheKey {
  country: string;
  team: string;
  timezone: string;
}

function generateCacheKey({ country, team, timezone }: CacheKey): string {
  return `${country}_${team}_${timezone}`;
}

export async function getCachedMatches(cacheKey: CacheKey) {
  const key = generateCacheKey(cacheKey);

  // Try to get cached data
  const cachedData = await cacheProvider.get(key);
  if (cachedData) {
    return cachedData;
  }

  // Fetch fresh data
  const results = await getMatches(cacheKey.country, cacheKey.team, {
    timezone: cacheKey.timezone,
  });

  // Store in cache
  await cacheProvider.set(key, results);

  return results || [];
}
