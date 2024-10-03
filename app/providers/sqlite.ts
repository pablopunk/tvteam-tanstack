import Database from "better-sqlite3";

// Initialize the database and create the cache table if it doesn't exist
const db = new Database("cache.db");

db.exec(`
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
