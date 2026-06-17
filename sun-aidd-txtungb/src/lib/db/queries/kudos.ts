import "server-only";
import { eq, desc, and, inArray, sql } from "drizzle-orm";
import { db } from "../index";
import {
  kudos,
  profiles,
  kudoHashtags,
  kudoImages,
} from "../schema";
import type { Kudo } from "@/lib/types";
import { randomUUID } from "crypto";
import {
  fetchKudoHashtags,
  fetchKudoImages,
  fetchHeartCount,
  fetchUserHasLiked,
  fetchProfile,
} from "./kudo-helpers";
import { updateUserTitle } from "./titles";

interface GetKudosOpts {
  page: number;
  pageSize: number;
  hashtagId?: string | null;
  departmentId?: string | null;
  currentUserId?: string | null;
}

export async function getKudos(opts: GetKudosOpts): Promise<Kudo[]> {
  const { page, pageSize, hashtagId, departmentId, currentUserId } = opts;
  const offset = (page - 1) * pageSize;

  const filters: Parameters<typeof and>[0][] = [];

  if (hashtagId) {
    const kudoIdsWithTag = await db
      .select({ kudoId: kudoHashtags.kudoId })
      .from(kudoHashtags)
      .where(eq(kudoHashtags.hashtagId, hashtagId));
    const ids = kudoIdsWithTag.map((r) => r.kudoId);
    if (ids.length === 0) return [];
    filters.push(inArray(kudos.id, ids));
  }

  if (departmentId) {
    const profilesInDept = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.departmentId, departmentId));
    const ids = profilesInDept.map((r) => r.id);
    if (ids.length === 0) return [];
    filters.push(inArray(kudos.senderId, ids));
  }

  const rows = await db
    .select({ kudo: kudos })
    .from(kudos)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(kudos.createdAt))
    .limit(pageSize)
    .offset(offset);

  const results: Kudo[] = [];
  for (const row of rows) {
    const kudoId = row.kudo.id;
    const [tags, images, heartCount, sender, receiver] = await Promise.all([
      fetchKudoHashtags(kudoId),
      fetchKudoImages(kudoId),
      fetchHeartCount(kudoId),
      fetchProfile(row.kudo.senderId),
      fetchProfile(row.kudo.receiverId),
    ]);
    const userHasLiked = currentUserId
      ? await fetchUserHasLiked(kudoId, currentUserId)
      : false;

    results.push({
      id: row.kudo.id,
      sender_id: row.kudo.senderId,
      receiver_id: row.kudo.receiverId,
      title: row.kudo.title,
      content: row.kudo.content,
      is_anonymous: row.kudo.isAnonymous,
      anonymous_name: row.kudo.anonymousName,
      created_at: row.kudo.createdAt,
      sender: sender ?? undefined,
      receiver: receiver ?? undefined,
      hashtags: tags,
      images,
      heart_count: heartCount,
      user_has_liked: userHasLiked,
    });
  }

  return results;
}

export async function getKudoById(id: string, currentUserId?: string | null): Promise<Kudo | null> {
  const rows = await db.select({ kudo: kudos }).from(kudos).where(eq(kudos.id, id)).limit(1);
  if (!rows[0]) return null;
  const row = rows[0];
  const kudoId = row.kudo.id;

  const [tags, images, heartCount, sender, receiver] = await Promise.all([
    fetchKudoHashtags(kudoId),
    fetchKudoImages(kudoId),
    fetchHeartCount(kudoId),
    fetchProfile(row.kudo.senderId),
    fetchProfile(row.kudo.receiverId),
  ]);
  const userHasLiked = currentUserId ? await fetchUserHasLiked(kudoId, currentUserId) : false;

  return {
    id: row.kudo.id,
    sender_id: row.kudo.senderId,
    receiver_id: row.kudo.receiverId,
    title: row.kudo.title,
    content: row.kudo.content,
    is_anonymous: row.kudo.isAnonymous,
    anonymous_name: row.kudo.anonymousName,
    created_at: row.kudo.createdAt,
    sender: sender ?? undefined,
    receiver: receiver ?? undefined,
    hashtags: tags,
    images,
    heart_count: heartCount,
    user_has_liked: userHasLiked,
  };
}

interface SubmitKudoInput {
  senderId: string;
  receiverId: string;
  title?: string;
  content: string;
  isAnonymous: boolean;
  anonymousName?: string;
  hashtagIds: string[];
  imageUrls: string[];
}

export async function submitKudo(
  input: SubmitKudoInput
): Promise<{ kudoId: string }> {
  const kudoId = randomUUID();

  await db.insert(kudos).values({
    id: kudoId,
    senderId: input.senderId,
    receiverId: input.receiverId,
    title: input.title ?? null,
    content: input.content,
    isAnonymous: input.isAnonymous,
    anonymousName: input.anonymousName ?? null,
  });

  if (input.hashtagIds.length > 0) {
    await db.insert(kudoHashtags).values(
      input.hashtagIds.map((hashtagId) => ({ kudoId, hashtagId }))
    );
  }

  if (input.imageUrls.length > 0) {
    await db.insert(kudoImages).values(
      input.imageUrls.map((url, orderIndex) => ({
        id: randomUUID(),
        kudoId,
        url,
        orderIndex,
      }))
    );
  }

  await db
    .update(profiles)
    .set({ kudosSentCount: sql`${profiles.kudosSentCount} + 1` })
    .where(eq(profiles.id, input.senderId));

  await db
    .update(profiles)
    .set({ kudosReceivedCount: sql`${profiles.kudosReceivedCount} + 1` })
    .where(eq(profiles.id, input.receiverId));

  await updateUserTitle(input.receiverId);

  return { kudoId };
}
