"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/use-user";
import { useEffect, useState } from "react";

interface HeartButtonProps {
  kudoId: string;
  senderId: string;
  initialCount: number;
  initialLiked: boolean;
}

export function HeartButton({
  kudoId,
  senderId,
  initialCount,
  initialLiked,
}: HeartButtonProps) {
  const { user } = useUser();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [popped, setPopped] = useState(false);

  const isSender = user?.id === senderId;
  const disabled = !user || isSender || pending;

  useEffect(() => {
    try {
      const supabase = createClient();
      const ch = supabase
        .channel(`hearts-${kudoId}`)
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "kudo_hearts", filter: `kudo_id=eq.${kudoId}` },
          async () => {
            const { count: latest } = await supabase
              .from("kudo_hearts")
              .select("*", { count: "exact", head: true } as any)
              .eq("kudo_id", kudoId);
            if (latest !== null) setCount(latest);
          }
        )
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    } catch { /* not configured */ }
  }, [kudoId]);

  async function toggle() {
    if (disabled) return;
    const supabase = createClient();
    setPending(true);

    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
      await supabase.from("kudo_hearts").delete().match({ kudo_id: kudoId, user_id: user!.id });
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      setPopped(true);
      setTimeout(() => setPopped(false), 300);
      await supabase.from("kudo_hearts").upsert({ kudo_id: kudoId, user_id: user!.id, count: 1 });
    }
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        liked ? "text-primary" : "text-muted hover:text-primary"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className={popped ? "animate-heart-pop" : ""}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{count}</span>
    </button>
  );
}
