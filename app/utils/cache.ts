import db from "../providers/sqlite";
import { getMatches } from "../providers/livesoccertv";

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
		.query(
			`SELECT result FROM cache WHERE country = ? AND team = ? AND timezone = ? AND timestamp > ?`,
		)
		.get(country, team, timezone, oneMinuteAgo);

	if (cached) {
		// Return the cached result
		return JSON.parse(cached.result);
	}

	// If no valid cached result, fetch new data
	const results = await getMatches(country, team, { timezone });

	// Store the new result in the cache
	db.run(
		`INSERT OR REPLACE INTO cache (country, team, timezone, result, timestamp) VALUES (?, ?, ?, ?, ?)`,
		country,
		team,
		timezone,
		JSON.stringify(results),
		Date.now(),
	);

	return results || [];
}
