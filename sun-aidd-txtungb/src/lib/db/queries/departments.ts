import "server-only";
import { asc } from "drizzle-orm";
import { db } from "../index";
import { departments } from "../schema";

export async function getDepartments(): Promise<{ id: string; name: string }[]> {
  const rows = await db
    .select()
    .from(departments)
    .orderBy(asc(departments.name));

  return rows.map((r) => ({ id: r.id, name: r.name }));
}
