"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import type { Profile } from "@/lib/types";

const TABS = [
  { label: "Overview", href: "/admin" },
  { label: "Review content", href: "/admin/review-content" },
  { label: "Role", href: "/admin/role" },
  { label: "Settings", href: "/admin/settings" },
];

interface AdminHeaderProps {
  user: Profile | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const initials = user?.display_name?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#101417]/80 backdrop-blur-sm z-50 border-b border-[#2E3940] flex items-center px-6 gap-6">
      <div className="flex items-center gap-4 shrink-0">
        <img src="/aidd-logo.png" alt="SAA" className="h-8 w-auto" />
        <div className="w-px h-6 bg-[#999999]" />
        <span className="text-[#FFEA9E] font-bold text-sm tracking-widest">ADMIN</span>
      </div>

      <nav className="flex items-center gap-1 flex-1">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "text-[#FFEA9E] bg-[#2E3940]"
                  : "text-[#999999] hover:text-white hover:bg-[#2E3940]/50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <NotificationBell count={0} />
        <LanguageSwitcher />
        <div className="w-9 h-9 rounded-full bg-[#2E3940] text-white font-bold text-sm flex items-center justify-center shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}
