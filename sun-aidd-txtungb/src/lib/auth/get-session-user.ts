import "server-only";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Profile } from "@/lib/types";

export async function getSessionUser(): Promise<Profile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);
  if (!rows[0]) return null;
  const p = rows[0];
  return {
    id: p.id,
    display_name: p.displayName,
    avatar_url: p.avatarUrl,
    department_id: p.departmentId,
    role: p.role as "user" | "admin",
    kudos_received_count: p.kudosReceivedCount,
    kudos_sent_count: p.kudosSentCount,
    hearts_received_count: p.heartsReceivedCount,
  };
}
