import "server-only";
import { asc } from "drizzle-orm";
import { db } from "../index";
import { hashtags } from "../schema";
import type { Hashtag } from "@/lib/types";

export async function getHashtags(): Promise<Hashtag[]> {
  const rows = await db
    .select()
    .from(hashtags)
    .orderBy(asc(hashtags.name));

  return rows.map((r) => ({ id: r.id, name: r.name }));
}
