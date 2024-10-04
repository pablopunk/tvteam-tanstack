import { getMatches } from "@/providers/livesoccertv";
import db from "@/providers/sqlite";

interface CacheKey {
	country: string;
	team: string;
	timezone: string;
}

export async function getCachedMatches({ country, team, timezone }: CacheKey) {
	// Calculate the timestamp for 1 minute ago
	const oneMinuteAgo = Date.now() - 60000; // 60000ms = 1 minute

	// Check the cache for a recent entry
	const cached = db
		.prepare<[string, string, string, number], { result: string }>(
			"SELECT result FROM cache WHERE country = ? AND team = ? AND timezone = ? AND timestamp > ?",
		)
		.get(country, team, timezone, oneMinuteAgo);

	if (cached) {
		console.log(`*Serving from cache [${country}, ${team}, ${timezone}]`);
		try {
			const cachedResult = JSON.parse(cached?.result);
			if (cachedResult.length > 0) {
				return cachedResult;
			}
		} catch (err) {}
	}

	// If no valid cached result, fetch new data
	const results = await getMatches(country, team, { timezone });

	// Store the new result in the cache
	db.prepare(
		"INSERT OR REPLACE INTO cache (country, team, timezone, result, timestamp) VALUES (?, ?, ?, ?, ?)",
	).run(country, team, timezone, JSON.stringify(results), Date.now());

	return results || [];
}
