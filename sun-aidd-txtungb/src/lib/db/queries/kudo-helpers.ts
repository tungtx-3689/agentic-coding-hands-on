import "server-only";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../index";
import { kudoHashtags, kudoHearts, hashtags, profiles } from "../schema";
import type { Profile, Hashtag } from "@/lib/types";

export function mapProfile(row: {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  departmentId: string | null;
  role: "user" | "admin";
  kudosReceivedCount: number;
  kudosSentCount: number;
  heartsReceivedCount: number;
}): Profile {
  return {
    id: row.id,
    display_name: row.displayName,
    avatar_url: row.avatarUrl,
    department_id: row.departmentId,
    role: row.role,
    kudos_received_count: row.kudosReceivedCount,
    kudos_sent_count: row.kudosSentCount,
    hearts_received_count: row.heartsReceivedCount,
  };
}

export async function fetchKudoHashtags(kudoId: string): Promise<Hashtag[]> {
  const rows = await db
    .select({ id: hashtags.id, name: hashtags.name })
    .from(hashtags)
    .innerJoin(kudoHashtags, eq(kudoHashtags.hashtagId, hashtags.id))
    .where(eq(kudoHashtags.kudoId, kudoId));
  return rows;
}

export async function fetchHeartCount(kudoId: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(kudoHearts)
    .where(eq(kudoHearts.kudoId, kudoId));
  return row[0]?.count ?? 0;
}

export async function fetchUserHasLiked(
  kudoId: string,
  userId: string
): Promise<boolean> {
  const row = await db
    .select({ kudoId: kudoHearts.kudoId })
    .from(kudoHearts)
    .where(and(eq(kudoHearts.kudoId, kudoId), eq(kudoHearts.userId, userId)))
    .limit(1);
  return row.length > 0;
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return rows[0] ? mapProfile(rows[0]) : null;
}
