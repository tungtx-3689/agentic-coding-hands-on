import "server-only";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../index";
import { kudoHearts, kudos, profiles } from "../schema";

export async function toggleHeart(
  kudoId: string,
  userId: string
): Promise<{ liked: boolean; count: number }> {
  const existing = await db
    .select({ kudoId: kudoHearts.kudoId })
    .from(kudoHearts)
    .where(and(eq(kudoHearts.kudoId, kudoId), eq(kudoHearts.userId, userId)))
    .limit(1);

  const liked = existing.length === 0;

  if (liked) {
    await db.insert(kudoHearts).values({ kudoId, userId });
  } else {
    await db
      .delete(kudoHearts)
      .where(
        and(eq(kudoHearts.kudoId, kudoId), eq(kudoHearts.userId, userId))
      );
  }

  const countRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(kudoHearts)
    .where(eq(kudoHearts.kudoId, kudoId));
  const count = countRow[0]?.count ?? 0;

  // Update receiver's hearts_received_count
  const kudoRow = await db
    .select({ receiverId: kudos.receiverId })
    .from(kudos)
    .where(eq(kudos.id, kudoId))
    .limit(1);

  if (kudoRow[0]) {
    await db
      .update(profiles)
      .set({
        heartsReceivedCount: sql`${profiles.heartsReceivedCount} + ${liked ? 1 : -1}`,
      })
      .where(eq(profiles.id, kudoRow[0].receiverId));
  }

  return { liked, count };
}

export async function getHeartCount(kudoId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(kudoHearts)
    .where(eq(kudoHearts.kudoId, kudoId));
  return row[0]?.count ?? 0;
}
