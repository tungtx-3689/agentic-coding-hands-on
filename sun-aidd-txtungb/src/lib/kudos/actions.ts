"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { submitKudo as dbSubmitKudo } from "@/lib/db/queries/kudos";
import { searchProfiles as dbSearchProfiles } from "@/lib/db/queries/profiles";
import { getHashtags as dbGetHashtags } from "@/lib/db/queries/hashtags";
import { toggleHeart as dbToggleHeart } from "@/lib/db/queries/hearts";

export interface SubmitKudoInput {
  receiverId: string;
  title?: string;
  content: string;
  hashtagIds: string[];
  imageUrls: string[];
  isAnonymous: boolean;
  anonymousName?: string;
}

export async function submitKudo(input: SubmitKudoInput) {
  const user = await getSessionUser();
  if (!user) return { error: "Unauthenticated" };

  const { kudoId } = await dbSubmitKudo({
    senderId: user.id,
    receiverId: input.receiverId,
    title: input.title,
    content: input.content,
    isAnonymous: input.isAnonymous,
    anonymousName: input.anonymousName,
    hashtagIds: input.hashtagIds,
    imageUrls: input.imageUrls,
  });

  revalidatePath("/kudos");
  return { kudoId };
}

export async function toggleHeartAction(kudoId: string) {
  const user = await getSessionUser();
  if (!user) return { error: "Unauthenticated" };
  const result = await dbToggleHeart(kudoId, user.id);
  revalidatePath("/kudos");
  return result;
}

export async function searchProfiles(query: string) {
  return dbSearchProfiles(query);
}

export async function getHashtags() {
  return dbGetHashtags();
}
