"use client";

import { useState } from "react";
import { Dropdown } from "./dropdown";

interface HashtagFilterDropdownProps {
  hashtags: Array<{ id: string; name: string }>;
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function HashtagFilterDropdown({
  hashtags,
  selected,
  onSelect,
}: HashtagFilterDropdownProps) {
  const [query, setQuery] = useState("");

  const selectedTag = hashtags.find((h) => h.id === selected);
  const triggerLabel = selectedTag ? `#${selectedTag.name}` : "#Hashtag";

  const filtered = hashtags.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(id: string | null) {
    onSelect(id);
    setQuery("");
  }

  const trigger = (
    <button
      type="button"
      className="bg-[#101417] border border-[#2e3940] rounded-full px-4 py-2 text-sm text-white cursor-pointer hover:border-[#998c5f] transition-colors duration-150"
    >
      {triggerLabel}
    </button>
  );

  return (
    <Dropdown trigger={trigger}>
      <div className="p-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm hashtag..."
          className="bg-[#00101a] border border-[#998c5f] rounded px-3 py-1.5 text-sm text-white placeholder-[#999999] w-full outline-none focus:border-[#ffea9e] transition-colors duration-150"
        />
      </div>
      <ul>
        {selected !== null && (
          <li>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#00070c] cursor-pointer transition-colors duration-150"
            >
              Tất cả
            </button>
          </li>
        )}
        {filtered.map((hashtag) => (
          <li key={hashtag.id}>
            <button
              type="button"
              onClick={() => handleSelect(hashtag.id)}
              className={[
                "w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-[#00070c] transition-colors duration-150",
                hashtag.id === selected ? "text-[#ffea9e]" : "text-white",
              ].join(" ")}
            >
              #{hashtag.name}
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-2 text-sm text-[#999999]">
            Không tìm thấy
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
