import { Database } from "bun:sqlite";

// Initialize the database and create the cache table if it doesn't exist
const db = new Database("cache.db");

db.run(`
  CREATE TABLE IF NOT EXISTS cache (
    country TEXT,
    team TEXT,
    timezone TEXT,
    result TEXT,
    timestamp INTEGER,
    PRIMARY KEY (country, team, timezone)
  )
`);

export default db;
