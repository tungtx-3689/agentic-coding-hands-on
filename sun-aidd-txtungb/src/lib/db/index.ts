import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const SEED_DB_PATH = path.join(process.cwd(), "data", "app.db");
// Vercel project root is read-only — use /tmp for writes
const DB_PATH = process.env.VERCEL ? "/tmp/app.db" : SEED_DB_PATH;

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof drizzle> | undefined;
}

function createDb() {
  if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
    fs.copyFileSync(SEED_DB_PATH, DB_PATH);
  }
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export const db = globalThis.__db ?? (globalThis.__db = createDb());
