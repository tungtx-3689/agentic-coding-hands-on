"use client";

import type { Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface KudosHighlightCarouselProps {
  kudos: Kudo[];
}

export function KudosHighlightCarousel({ kudos }: KudosHighlightCarouselProps) {
  const t = useTranslations("kudos");

  if (!kudos.length) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
        {t("highlightTitle")}
      </h2>
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {kudos.map((kudo) => {
          const sender = kudo.is_anonymous
            ? (kudo.anonymous_name ?? "Ẩn danh")
            : (kudo.sender?.display_name ?? "Unknown");
          const receiver = kudo.receiver?.display_name ?? "Unknown";

          return (
            <Link
              key={kudo.id}
              href={`/kudos/${kudo.id}`}
              className="w-64 shrink-0 snap-start bg-container border border-divider hover:border-border rounded-xl p-4 flex flex-col gap-2 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="truncate max-w-[45%]">{sender}</span>
                <span className="shrink-0 px-1">→</span>
                <span className="truncate max-w-[45%] text-right">{receiver}</span>
              </div>
              <p className="text-sm text-text line-clamp-3 leading-relaxed flex-1">
                {kudo.content}
              </p>
              <div className="flex items-center justify-between mt-auto">
                {kudo.hashtags && kudo.hashtags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {kudo.hashtags.slice(0, 2).map((tag) => (
                      <span key={tag.id} className="text-xs text-primary">#{tag.name}</span>
                    ))}
                  </div>
                )}
                {(kudo.heart_count ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted ml-auto">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{kudo.heart_count}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
