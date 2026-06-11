"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(next: string) {
    if (next === locale) return;
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-border overflow-hidden">
      {(["vi", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`px-3 py-1 text-xs font-semibold uppercase transition-colors ${
            locale === lang
              ? "bg-primary text-bg"
              : "bg-transparent text-text hover:text-primary"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
