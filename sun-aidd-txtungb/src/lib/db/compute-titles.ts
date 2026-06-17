import { db } from "./index";
import { computeTitle } from "./queries/titles";

type UniqueSendersRow = { receiver_id: string; unique_senders: number };

async function main() {
  db.$client.exec(`
    CREATE TABLE IF NOT EXISTS user_title_cache (
      user_id TEXT PRIMARY KEY,
      title TEXT,
      unique_senders_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const rows = db.$client.prepare(`
    SELECT receiver_id, COUNT(DISTINCT sender_id) AS unique_senders
    FROM kudos
    GROUP BY receiver_id
  `).all() as UniqueSendersRow[];

  for (const row of rows) {
    const title = computeTitle(row.unique_senders);
    db.$client.prepare(`
      INSERT INTO user_title_cache (user_id, title, unique_senders_count, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        title = excluded.title,
        unique_senders_count = excluded.unique_senders_count,
        updated_at = CURRENT_TIMESTAMP
    `).run(row.receiver_id, title, row.unique_senders);
    console.log(`✓ ${row.receiver_id}: ${title ?? "—"} (${row.unique_senders} unique senders)`);
  }

  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
