"use client";

import type { Hashtag, Kudo } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { KudosFilters } from "./kudos-filters";
import { SpotlightBoard } from "./spotlight-board";

interface SpotlightProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  kudos_received_count: number;
}

interface KudosTabsProps {
  initialKudos: Kudo[];
  hashtags: Hashtag[];
  departments: Array<{ id: string; name: string }>;
  currentUserId?: string;
  spotlightProfiles: SpotlightProfile[];
}

type Tab = "feed" | "spotlight";

export function KudosTabs({
  initialKudos,
  hashtags,
  departments,
  currentUserId,
  spotlightProfiles,
}: KudosTabsProps) {
  const t = useTranslations("kudos");
  const [activeTab, setActiveTab] = useState<Tab>("feed");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-divider">
        {(["feed", "spotlight"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-text",
            ].join(" ")}
          >
            {tab === "feed" ? t("allKudos") : t("spotlight")}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "feed" ? (
        <KudosFilters
          initialKudos={initialKudos}
          hashtags={hashtags}
          departments={departments}
          currentUserId={currentUserId}
        />
      ) : (
        <SpotlightBoard profiles={spotlightProfiles} />
      )}
    </div>
  );
}
