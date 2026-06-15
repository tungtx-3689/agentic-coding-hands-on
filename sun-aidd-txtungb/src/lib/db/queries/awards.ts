import "server-only";
import { db } from "../index";
import { awards } from "../schema";
import type { Award } from "@/lib/types";

export async function getAwards(): Promise<Award[]> {
  const rows = await db.select().from(awards);

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    count: r.count,
    value: r.value,
    image_url: r.imageUrl ?? undefined,
  }));
}
