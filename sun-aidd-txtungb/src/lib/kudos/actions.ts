"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SubmitKudoInput {
  receiverId: string;
  content: string;
  hashtagIds: string[];
  imageUrls: string[];
  isAnonymous: boolean;
  anonymousName?: string;
}

export async function submitKudo(input: SubmitKudoInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated" };

  const { data: kudo, error: kudoError } = await supabase
    .from("kudos")
    .insert({
      sender_id: user.id,
      receiver_id: input.receiverId,
      content: input.content,
      is_anonymous: input.isAnonymous,
      anonymous_name: input.isAnonymous ? input.anonymousName ?? null : null,
    })
    .select("id")
    .single();

  if (kudoError || !kudo) return { error: kudoError?.message ?? "Failed" };

  if (input.hashtagIds.length > 0) {
    await supabase.from("kudo_hashtags").insert(
      input.hashtagIds.map((hashtagId) => ({ kudo_id: kudo.id, hashtag_id: hashtagId }))
    );
  }

  if (input.imageUrls.length > 0) {
    await supabase.from("kudo_images").insert(
      input.imageUrls.map((url, i) => ({ kudo_id: kudo.id, url, order_index: i }))
    );
  }

  revalidatePath("/kudos");
  return { kudoId: kudo.id };
}

export async function searchProfiles(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .ilike("display_name", `%${query}%`)
    .limit(10);
  return data ?? [];
}

export async function getHashtags() {
  const supabase = await createClient();
  const { data } = await supabase.from("hashtags").select("id, name").order("name");
  return data ?? [];
}
