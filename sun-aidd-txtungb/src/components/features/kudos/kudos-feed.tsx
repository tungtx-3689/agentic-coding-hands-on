"use client";

import { KudoCard } from "@/components/features/kudos/kudo-card";
import type { Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

async function fetchKudosPage(
  page: number,
  hashtagId: string | null,
  departmentId: string | null
): Promise<Kudo[]> {
  const params = new URLSearchParams({ page: String(page) });
  if (hashtagId) params.set("hashtagId", hashtagId);
  if (departmentId) params.set("departmentId", departmentId);
  const res = await fetch(`/api/kudos?${params}`);
  if (!res.ok) return [];
  return res.json();
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
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = await fetchKudosPage(page + 1, hashtagId, departmentId);
    setKudos((prev) => [...prev, ...next]);
    setPage((p) => p + 1);
    setHasMore(next.length === PAGE_SIZE);
    setLoading(false);
  }, [page, hashtagId, departmentId, loading, hasMore]);

  useEffect(() => {
    setKudos(initialKudos);
    setPage(1);
    setHasMore(initialKudos.length === PAGE_SIZE);
  }, [hashtagId, departmentId, initialKudos]);

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
    return <p className="text-center text-muted py-16">{t("empty")}</p>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-[80%]">
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
