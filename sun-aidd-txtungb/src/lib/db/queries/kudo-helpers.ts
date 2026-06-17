import "server-only";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../index";
import { kudoHashtags, kudoHearts, kudoImages, hashtags, profiles } from "../schema";
import type { Profile, Hashtag, KudoImage } from "@/lib/types";

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

export async function fetchKudoImages(kudoId: string): Promise<KudoImage[]> {
  const rows = await db
    .select()
    .from(kudoImages)
    .where(eq(kudoImages.kudoId, kudoId))
    .orderBy(kudoImages.orderIndex);
  return rows.map((r) => ({
    id: r.id,
    kudo_id: r.kudoId,
    url: r.url,
    order_index: r.orderIndex,
  }));
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

type RawProfileRow = {
  id: string; display_name: string | null; avatar_url: string | null;
  department_id: string | null; role: "user" | "admin";
  kudos_received_count: number; kudos_sent_count: number; hearts_received_count: number;
  department_name: string | null; title: string | null;
};

export async function fetchProfile(id: string): Promise<Profile | null> {
  const row = db.$client.prepare(`
    SELECT p.id, p.display_name, p.avatar_url, p.department_id, p.role,
           p.kudos_received_count, p.kudos_sent_count, p.hearts_received_count,
           d.name AS department_name, utc.title
    FROM profiles p
    LEFT JOIN departments d ON d.id = p.department_id
    LEFT JOIN user_title_cache utc ON utc.user_id = p.id
    WHERE p.id = ?
    LIMIT 1
  `).get(id) as RawProfileRow | undefined;

  if (!row) return null;
  return {
    id: row.id,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    department_id: row.department_id,
    role: row.role,
    kudos_received_count: row.kudos_received_count,
    kudos_sent_count: row.kudos_sent_count,
    hearts_received_count: row.hearts_received_count,
    department_name: row.department_name,
    title: row.title,
  };
}
