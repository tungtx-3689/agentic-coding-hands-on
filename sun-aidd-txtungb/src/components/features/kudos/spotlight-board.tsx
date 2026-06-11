"use client";

import { StarBadge } from "@/components/ui/star-badge";

interface SpotlightProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  kudos_received_count: number;
}

interface SpotlightBoardProps {
  profiles: SpotlightProfile[];
}

const PODIUM_ORDER = [1, 0, 2]; // 2nd, 1st, 3rd rendered left-to-right

function ProfileAvatar({ profile, size }: { profile: SpotlightProfile; size: number }) {
  const initials = (profile.display_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-divider flex items-center justify-center font-semibold text-primary shrink-0 overflow-hidden"
    >
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.35 }}>{initials}</span>
      )}
    </div>
  );
}

const RANK_HEIGHTS = ["h-24", "h-32", "h-20"]; // 2nd, 1st, 3rd podium heights

export function SpotlightBoard({ profiles }: SpotlightBoardProps) {
  if (profiles.length === 0) {
    return (
      <p className="text-center text-muted py-16">Chưa có dữ liệu Spotlight.</p>
    );
  }

  const podium = profiles.slice(0, 3);
  const rest = profiles.slice(3);

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* Podium — top 3 */}
      <div className="flex items-end justify-center gap-4">
        {PODIUM_ORDER.map((rankIndex) => {
          const profile = podium[rankIndex];
          if (!profile) return <div key={rankIndex} className="w-28" />;
          const rank = rankIndex + 1;
          const isFirst = rank === 1;
          return (
            <div key={profile.id} className="flex flex-col items-center gap-2 w-28">
              {isFirst && (
                <span className="text-xl" role="img" aria-label="crown">👑</span>
              )}
              <ProfileAvatar profile={profile} size={isFirst ? 72 : 56} />
              <div className="text-center">
                <p className="text-xs font-semibold text-text truncate w-full">
                  {profile.display_name}
                </p>
                <StarBadge count={profile.kudos_received_count} />
              </div>
              {/* Podium block */}
              <div
                className={[
                  "w-full rounded-t-lg flex flex-col items-center justify-start pt-2 gap-1",
                  RANK_HEIGHTS[rankIndex],
                  isFirst
                    ? "bg-primary/20 border border-primary/40"
                    : "bg-container border border-divider",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-lg font-bold",
                    isFirst ? "text-primary" : "text-muted",
                  ].join(" ")}
                >
                  #{rank}
                </span>
                <span className="text-xs text-muted">{profile.kudos_received_count} kudos</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest — rank 4+ */}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          {rest.map((profile, i) => (
            <div
              key={profile.id}
              className="flex items-center gap-3 bg-container border border-divider rounded-xl px-4 py-3 hover:border-border transition-colors"
            >
              <span className="text-sm font-bold text-muted w-6 shrink-0">#{i + 4}</span>
              <ProfileAvatar profile={profile} size={36} />
              <span className="text-sm text-text flex-1 min-w-0 truncate">
                {profile.display_name}
              </span>
              <StarBadge count={profile.kudos_received_count} />
              <span className="text-xs text-muted shrink-0">
                {profile.kudos_received_count} kudos
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
