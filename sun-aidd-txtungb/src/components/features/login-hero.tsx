"use client";

import { signInAsDemo } from "@/lib/auth/actions";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslations } from "next-intl";

export function LoginHero() {
  const t = useTranslations("login");

  return (
    <div className="relative min-h-screen flex flex-col bg-[#00101a] overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #ffea9e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #998c5f 0%, transparent 40%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-10 py-5">
        <span className="text-[#ffea9e] font-bold text-xl tracking-widest">SAA</span>
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[#ffea9e] tracking-widest mb-6">
          {t("title")}
        </h1>
        <p className="text-[#ffffff] text-lg mb-12 max-w-md opacity-80">
          {t("welcome")}
        </p>

        <form action={signInAsDemo}>
          <button
            type="submit"
            className="flex items-center gap-3 bg-white text-[#00101a] font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <span>{t("signIn")}</span>
          </button>
        </form>
      </main>

      <footer className="relative z-10 border-t border-divider py-5 px-10 flex items-center justify-between">
        <p className="text-xs text-muted">© 2025 Sun Asterisk Inc.</p>
        <p className="text-xs text-muted">SAA 2025 — Root Further</p>
      </footer>
    </div>
  );
}
