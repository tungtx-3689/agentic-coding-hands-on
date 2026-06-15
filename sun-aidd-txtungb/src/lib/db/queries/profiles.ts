import "server-only";
import { eq, desc, like } from "drizzle-orm";
import { db } from "../index";
import { profiles } from "../schema";
import type { Profile } from "@/lib/types";

function mapProfile(row: typeof profiles.$inferSelect): Profile {
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

export async function getProfile(id: string): Promise<Profile | null> {
  const row = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return row[0] ? mapProfile(row[0]) : null;
}

export async function searchProfiles(
  query: string
): Promise<Pick<Profile, "id" | "display_name" | "avatar_url">[]> {
  const rows = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(like(profiles.displayName, `%${query.toLowerCase()}%`))
    .limit(10);

  return rows.map((r) => ({
    id: r.id,
    display_name: r.displayName,
    avatar_url: r.avatarUrl,
  }));
}

export async function getTopProfiles(limit: number): Promise<Profile[]> {
  const rows = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.kudosReceivedCount))
    .limit(limit);
  return rows.map(mapProfile);
}
