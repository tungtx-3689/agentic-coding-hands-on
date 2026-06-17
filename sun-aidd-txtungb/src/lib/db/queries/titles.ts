import "server-only";
import { db } from "../index";

export type UserTitle = "New Hero" | "Rising Hero" | "Super Hero" | "Legend Hero";

export function computeTitle(uniqueSenders: number): UserTitle | null {
  if (uniqueSenders >= 21) return "Legend Hero";
  if (uniqueSenders >= 10) return "Super Hero";
  if (uniqueSenders >= 5)  return "Rising Hero";
  if (uniqueSenders >= 1)  return "New Hero";
  return null;
}

export async function updateUserTitle(userId: string): Promise<void> {
  const row = db.$client.prepare(`
    SELECT COUNT(DISTINCT sender_id) AS unique_senders
    FROM kudos
    WHERE receiver_id = ?
  `).get(userId) as { unique_senders: number } | undefined;

  const uniqueSenders = row?.unique_senders ?? 0;
  const title = computeTitle(uniqueSenders);

  db.$client.prepare(`
    INSERT INTO user_title_cache (user_id, title, unique_senders_count, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      title = excluded.title,
      unique_senders_count = excluded.unique_senders_count,
      updated_at = CURRENT_TIMESTAMP
  `).run(userId, title, uniqueSenders);
}
