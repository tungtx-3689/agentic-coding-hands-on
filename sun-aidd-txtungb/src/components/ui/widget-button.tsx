"use client";

import Link from "next/link";

export function WidgetButton() {
  return (
    <Link
      href="/kudos/write"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#ffea9e] text-[#00101a] font-semibold px-5 py-3 rounded-full shadow-2xl hover:bg-[#fff8e1] transition-colors duration-200"
      aria-label="Viết Kudo"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      <span className="text-sm">Kudos</span>
    </Link>
  );
}
