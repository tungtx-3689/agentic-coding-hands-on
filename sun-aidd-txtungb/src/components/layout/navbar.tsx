"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";

interface NavbarProps {
  user: User | null;
}

const NAV_LINKS = [
  { key: "about" as const, href: "/" },
  { key: "awards" as const, href: "/awards" },
  { key: "kudos" as const, href: "/kudos" },
] as const;

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#0B0F12]/20 backdrop-blur-sm z-50 border-b border-divider">
      <div className="max-w-[1512px] mx-auto px-36 max-md:px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <span className="text-primary font-bold text-xl tracking-widest uppercase">SAA 2025</span>
          <img src="/aidd-logo.png" alt="Sun*" className="h-8 w-auto" />
        </Link>

        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary underline underline-offset-4"
                    : "text-white hover:text-primary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <NotificationBell count={0} />
          <LanguageSwitcher />
          <AvatarDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
