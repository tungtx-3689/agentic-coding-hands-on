"use client";

import { KudoCard } from "@/components/features/kudos/kudo-card";
import { createClient } from "@/lib/supabase/client";
import type { Hashtag, Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

async function fetchKudos(
  page: number,
  hashtagId: string | null,
  departmentId: string | null,
  currentUserId: string | null
): Promise<Kudo[]> {
  const supabase = createClient();
  let query = supabase
    .from("kudos")
    .select(
      `id, sender_id, receiver_id, content, is_anonymous, anonymous_name, created_at,
       sender:profiles!kudos_sender_id_fkey(id, display_name, avatar_url, department_id, kudos_received_count),
       receiver:profiles!kudos_receiver_id_fkey(id, display_name, avatar_url, kudos_received_count),
       hashtags:kudo_hashtags(hashtag:hashtags(id, name)),
       kudo_hearts(count)`
    )
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (hashtagId) {
    query = query.eq("kudo_hashtags.hashtag_id", hashtagId);
  }

  const { data } = await query;
  if (!data) return [];

  const filtered = departmentId
    ? data.filter((row: any) => row.sender?.department_id === departmentId)
    : data;

  return filtered.map((row: any) => ({
    ...row,
    hashtags: (row.hashtags as unknown as { hashtag: Hashtag }[]).map(
      (h) => h.hashtag
    ),
    heart_count: (row.kudo_hearts as { count: number }[]).reduce(
      (s, h) => s + h.count,
      0
    ),
    user_has_liked: currentUserId
      ? (row.kudo_hearts as { count: number }[]).length > 0
      : false,
  })) as unknown as Kudo[];
}

interface KudosFeedProps {
  initialKudos: Kudo[];
  hashtagId: string | null;
  departmentId: string | null;
  currentUserId?: string;
}

export function KudosFeed({
  initialKudos,
  hashtagId,
  departmentId,
  currentUserId,
}: KudosFeedProps) {
  const t = useTranslations("kudos");
  const [kudos, setKudos] = useState<Kudo[]>(initialKudos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialKudos.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Realtime: watch for new kudos insertions
  useEffect(() => {
    try {
      const supabase = createClient();
      const ch = supabase
        .channel("kudos-feed-new")
        .on("postgres_changes" as any, { event: "INSERT", schema: "public", table: "kudos" }, () => {
          setNewCount((n) => n + 1);
        })
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    } catch { /* not configured */ }
  }, []);

  async function refreshFeed() {
    setLoading(true);
    const latest = await fetchKudos(0, hashtagId, departmentId, currentUserId ?? null);
    setKudos(latest);
    setPage(1);
    setHasMore(latest.length === PAGE_SIZE);
    setNewCount(0);
    setLoading(false);
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = await fetchKudos(page, hashtagId, departmentId, currentUserId ?? null);
    setKudos((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
    setHasMore(next.length === PAGE_SIZE);
    setLoading(false);
  }, [page, hashtagId, departmentId, currentUserId, loading, hasMore]);

  // Reset on filter change
  useEffect(() => {
    setKudos(initialKudos);
    setPage(1);
    setHasMore(initialKudos.length === PAGE_SIZE);
  }, [hashtagId, departmentId, initialKudos]);

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  if (kudos.length === 0 && !loading) {
    return (
      <p className="text-center text-muted py-16">{t("empty")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {newCount > 0 && (
        <button
          onClick={refreshFeed}
          className="w-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium py-2.5 rounded-xl hover:bg-primary/20 transition-colors"
        >
          {t("newKudos", { count: newCount })} · {t("loadNew")}
        </button>
      )}
      {kudos.map((kudo) => (
        <KudoCard key={kudo.id} kudo={kudo} currentUserId={currentUserId} />
      ))}
      <div ref={sentinelRef} className="h-4" />
      {loading && (
        <div className="text-center text-muted text-sm py-4">{t("loading")}</div>
      )}
    </div>
  );
}
