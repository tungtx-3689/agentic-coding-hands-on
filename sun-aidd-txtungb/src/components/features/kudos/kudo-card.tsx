"use client";

import { HeartButton } from "@/components/features/kudos/heart-button";
import { StarBadge } from "@/components/ui/star-badge";
import type { Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
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
    <div className="w-10 h-10 rounded-full bg-[#2e3940] flex items-center justify-center text-sm font-semibold text-[#ffea9e] shrink-0 overflow-hidden">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function KudoCard({ kudo, currentUserId }: KudoCardProps) {
  const t = useTranslations("kudos");

  const senderName =
    kudo.is_anonymous
      ? kudo.anonymous_name ?? "Ẩn danh"
      : kudo.sender?.display_name ?? "Unknown";
  const receiverName = kudo.receiver?.display_name ?? "Unknown";

  async function copyLink() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/kudos/${kudo.id}`
    );
  }

  return (
    <article className="bg-[#101417] border border-[#2e3940] rounded-xl p-5 flex flex-col gap-4 hover:border-[#998c5f] transition-colors duration-200">
      {/* Sender → Receiver */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={senderName} url={kudo.is_anonymous ? null : kudo.sender?.avatar_url} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate flex items-center gap-1">
              {senderName}
              {!kudo.is_anonymous && (
                <StarBadge count={kudo.sender?.kudos_received_count ?? 0} />
              )}
            </div>
            {!kudo.is_anonymous && kudo.sender?.department_id && (
              <div className="text-xs text-[#999999] truncate">—</div>
            )}
          </div>
        </div>

        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#998c5f" strokeWidth="2" className="shrink-0" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>

        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={receiverName} url={kudo.receiver?.avatar_url} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate flex items-center gap-1">
              {receiverName}
              <StarBadge count={kudo.receiver?.kudos_received_count ?? 0} />
            </div>
          </div>
        </div>

        <time className="ml-auto text-xs text-[#999999] shrink-0">
          {new Date(kudo.created_at).toLocaleDateString("vi-VN")}
        </time>
      </div>

      {/* Content */}
      <p
        className="text-[#ffffff] text-sm leading-relaxed line-clamp-3"
        dangerouslySetInnerHTML={{ __html: kudo.content }}
      />

      {/* Hashtags */}
      {kudo.hashtags && kudo.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {kudo.hashtags.slice(0, 5).map((tag) => (
            <span
              key={tag.id}
              className="text-xs text-[#ffea9e] bg-[#00070c] border border-[#2e3940] rounded-full px-2.5 py-0.5"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-[#2e3940]">
        <HeartButton
          kudoId={kudo.id}
          senderId={kudo.sender_id}
          initialCount={kudo.heart_count ?? 0}
          initialLiked={kudo.user_has_liked ?? false}
        />
        <button
          onClick={copyLink}
          className="text-xs text-[#999999] hover:text-white transition-colors"
        >
          {t("copyLink")}
        </button>
        <Link
          href={`/kudos/${kudo.id}`}
          className="ml-auto text-xs text-[#ffea9e] hover:underline"
        >
          {t("viewDetail")} →
        </Link>
      </div>
    </article>
  );
}
