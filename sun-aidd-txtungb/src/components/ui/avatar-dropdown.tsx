"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { signOut } from "@/lib/auth/actions";
import { Dropdown } from "./dropdown";

interface AvatarDropdownProps {
  user: User | null;
}

function getInitials(user: User): string {
  const name = user.user_metadata?.full_name as string | undefined;
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return (user.email ?? "?").slice(0, 2).toUpperCase();
}

export function AvatarDropdown({ user }: AvatarDropdownProps) {
  const t = useTranslations("profile");
  const isAdmin = user?.user_metadata?.role === "admin";

  if (!user) return null;

  const trigger = (
    <button
      className="w-9 h-9 rounded-full bg-border text-bg font-bold text-sm flex items-center justify-center hover:bg-primary transition-colors"
      aria-label="User menu"
    >
      {getInitials(user)}
    </button>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <Link
        href="/profile"
        className="block px-4 py-3 text-sm text-text hover:bg-divider transition-colors"
      >
        {t("profile")}
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="block px-4 py-3 text-sm text-text hover:bg-divider transition-colors"
        >
          {t("adminDashboard")}
        </Link>
      )}
      <div className="border-t border-divider" />
      <form action={signOut}>
        <button
          type="submit"
          className="w-full text-left px-4 py-3 text-sm text-text hover:bg-divider transition-colors"
        >
          {t("signOut")}
        </button>
      </form>
    </Dropdown>
  );
}
