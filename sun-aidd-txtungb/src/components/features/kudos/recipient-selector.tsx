"use client";

import { searchProfiles } from "@/lib/kudos/actions";
import { useCallback, useEffect, useRef, useState } from "react";

type Profile = { id: string; display_name: string | null; avatar_url: string | null };

interface RecipientSelectorProps {
  value: Profile | null;
  onChange: (profile: Profile | null) => void;
}

function MiniAvatar({ profile }: { profile: Profile }) {
  const initials = (profile.display_name ?? "?")[0].toUpperCase();
  return (
    <div className="w-7 h-7 rounded-full bg-divider flex items-center justify-center text-xs font-semibold text-primary shrink-0 overflow-hidden">
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function RecipientSelector({ value, onChange }: RecipientSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const data = await searchProfiles(q);
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  if (value) {
    return (
      <div className="flex items-center gap-2 bg-container-2 border border-border rounded-lg px-3 py-2">
        <MiniAvatar profile={value} />
        <span className="text-sm text-text flex-1">{value.display_name}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-muted hover:text-text transition-colors text-xl leading-none"
          aria-label="Xóa người nhận"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Tìm đồng đội..."
        className="w-full bg-container-2 border border-divider focus:border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-muted outline-none transition-colors"
      />
      {isOpen && (query.trim() || results.length > 0) && (
        <ul className="absolute top-full mt-1 left-0 right-0 z-50 bg-container border border-divider rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {loading && <li className="px-3 py-2 text-sm text-muted">Đang tìm...</li>}
          {!loading && results.length === 0 && query.trim() && (
            <li className="px-3 py-2 text-sm text-muted">Không tìm thấy</li>
          )}
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-container-2 transition-colors"
                onClick={() => { onChange(p); setIsOpen(false); setQuery(""); }}
              >
                <MiniAvatar profile={p} />
                {p.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
