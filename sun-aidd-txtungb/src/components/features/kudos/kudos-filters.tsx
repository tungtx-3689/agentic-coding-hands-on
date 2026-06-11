"use client";

import { DepartmentDropdown } from "@/components/ui/department-dropdown";
import { HashtagFilterDropdown } from "@/components/ui/hashtag-filter-dropdown";
import type { Kudo } from "@/lib/types";
import { useState } from "react";
import { KudosFeed } from "./kudos-feed";

interface KudosFiltersProps {
  initialKudos: Kudo[];
  hashtags: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  currentUserId?: string;
}

export function KudosFilters({
  initialKudos,
  hashtags,
  departments,
  currentUserId,
}: KudosFiltersProps) {
  const [hashtagId, setHashtagId] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <HashtagFilterDropdown
          hashtags={hashtags}
          selected={hashtagId}
          onSelect={setHashtagId}
        />
        <DepartmentDropdown
          departments={departments}
          selected={departmentId}
          onSelect={setDepartmentId}
        />
      </div>
      <KudosFeed
        initialKudos={initialKudos}
        hashtagId={hashtagId}
        departmentId={departmentId}
        currentUserId={currentUserId}
      />
    </>
  );
}
