"use client";

import { HeartButton } from "@/components/features/kudos/heart-button";
import type { Kudo } from "@/lib/types";
import Link from "next/link";

interface KudoCardProps {
  kudo: Kudo;
  currentUserId?: string;
}

function Avatar({ name, url }: { name: string; url?: string | null }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-divider flex items-center justify-center text-sm font-semibold text-primary overflow-hidden mx-auto">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

function PersonInfo({
  name,
  dept,
  title,
}: {
  name: string;
  dept?: string | null;
  title?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-sm font-bold text-bg truncate max-w-27.5">{name}</p>
      {(dept || title) && (
        <div className="flex items-center justify-center gap-1 max-w-27.5 overflow-hidden">
          {dept && <span className="text-[9px] text-muted truncate">{dept}</span>}
          {dept && title && <span className="text-[9px] text-muted shrink-0">-</span>}
          {title && (
            <span className="text-[9px] text-bg bg-primary rounded-full px-1.5 py-px whitespace-nowrap font-medium shrink-0">
              {title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function formatDatetime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `${hh}:${mi} - ${dd}/${mo}/${d.getFullYear()}`;
}

export function KudoCard({ kudo, currentUserId: _currentUserId }: KudoCardProps) {
  const senderName = kudo.is_anonymous
    ? (kudo.anonymous_name ?? "Ẩn danh")
    : (kudo.sender?.display_name ?? "Unknown");
  const receiverName = kudo.receiver?.display_name ?? "Unknown";

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/kudos/${kudo.id}`);
  }

  const imgCount = kudo.images?.length ?? 0;
  const imgGridClass =
    imgCount === 1 ? "grid-cols-1" : imgCount === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <article className="bg-btn-hover rounded-xl overflow-hidden border border-primary/40">
      {/* Header — 3 columns */}
      <div className="grid grid-cols-3 items-center gap-2 px-5 py-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar name={senderName} url={kudo.is_anonymous ? null : kudo.sender?.avatar_url} />
          <PersonInfo
            name={senderName}
            dept={kudo.is_anonymous ? undefined : kudo.sender?.department_name}
            title={kudo.is_anonymous ? undefined : kudo.sender?.title}
          />
        </div>

        <div className="flex justify-center">
          {/* Paper plane icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#998c5f" aria-hidden="true">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar name={receiverName} url={kudo.receiver?.avatar_url} />
          <PersonInfo
            name={receiverName}
            dept={kudo.receiver?.department_name}
            title={kudo.receiver?.title}
          />
        </div>
      </div>

      <div className="h-px bg-primary" />

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <time className="text-xs text-muted">{formatDatetime(kudo.created_at)}</time>

        {kudo.title && (
          <Link href={`/kudos/${kudo.id}`} className="text-sm font-semibold text-bg hover:underline w-fit">
            {kudo.title}
          </Link>
        )}

        <div className="bg-primary rounded-lg p-3">
          <p className="text-bg text-sm leading-relaxed">{kudo.content}</p>
        </div>

        {imgCount > 0 && (
          <div className={`grid ${imgGridClass} gap-2`}>
            {kudo.images!.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {kudo.hashtags && kudo.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {kudo.hashtags.map((tag) => (
              <span key={tag.id} className="text-xs text-[#d4271d] font-medium">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-primary" />

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <HeartButton
          kudoId={kudo.id}
          senderId={kudo.sender_id}
          initialCount={kudo.heart_count ?? 0}
          initialLiked={kudo.user_has_liked ?? false}
          variant="light"
        />
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs font-bold text-bg hover:opacity-60 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Copy Link
        </button>
      </div>
    </article>
  );
}
