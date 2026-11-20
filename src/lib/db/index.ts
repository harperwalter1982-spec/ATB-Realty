import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForPostgres = globalThis as typeof globalThis & {
  atbPostgresPool?: Pool;
};

const pool =
  globalForPostgres.atbPostgresPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 20_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.atbPostgresPool = pool;
}

export const db = drizzle(pool, { schema });
