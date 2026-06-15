"use client";

import { toggleHeartAction } from "@/lib/kudos/actions";
import { useUser } from "@/lib/hooks/use-user";
import { useState } from "react";

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

  async function toggle() {
    if (disabled) return;
    setPending(true);

    const prevLiked = liked;
    const prevCount = count;
    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      setPopped(true);
      setTimeout(() => setPopped(false), 300);
    }

    const result = await toggleHeartAction(kudoId);
    if ("error" in result) {
      setLiked(prevLiked);
      setCount(prevCount);
    } else {
      setLiked(result.liked);
      setCount(result.count);
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
