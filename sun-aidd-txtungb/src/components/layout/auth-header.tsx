"use client";

import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function AuthHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-10 py-5 bg-[#0B0F12]/20 backdrop-blur-sm">
      <span className="text-primary font-bold text-xl tracking-widest">SAA</span>
      <LanguageSwitcher />
    </header>
  );
}
