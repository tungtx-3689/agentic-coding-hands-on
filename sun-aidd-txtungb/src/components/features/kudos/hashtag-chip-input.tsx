"use client";

import type { Hashtag } from "@/lib/types";

interface HashtagChipInputProps {
  hashtags: Hashtag[];
  selected: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function HashtagChipInput({
  hashtags,
  selected,
  onChange,
  max = 5,
}: HashtagChipInputProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag) => {
        const isSelected = selected.includes(tag.id);
        const isDisabled = !isSelected && selected.length >= max;
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            disabled={isDisabled}
            className={[
              "text-xs rounded-full px-3 py-1 border transition-colors",
              isSelected
                ? "bg-primary text-bg border-primary font-semibold"
                : "bg-container-2 text-text border-divider hover:border-border",
              isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            #{tag.name}
          </button>
        );
      })}
      {hashtags.length === 0 && (
        <span className="text-xs text-muted">Chưa có hashtag nào</span>
      )}
    </div>
  );
}
