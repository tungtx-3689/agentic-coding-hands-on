"use client";

import { signInWithGoogle } from "@/lib/auth/actions";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslations } from "next-intl";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginHero() {
  const t = useTranslations("login");

  return (
    <div className="relative min-h-screen flex flex-col bg-[#00101a] overflow-hidden">
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #ffea9e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #998c5f 0%, transparent 40%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-5">
        <span className="text-[#ffea9e] font-bold text-xl tracking-widest">
          SAA
        </span>
        <LanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[#ffea9e] tracking-widest mb-6">
          {t("title")}
        </h1>
        <p className="text-[#ffffff] text-lg mb-12 max-w-md opacity-80">
          {t("welcome")}
        </p>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex items-center gap-3 bg-white text-[#00101a] font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <GoogleIcon />
            <span>{t("signIn")}</span>
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-divider py-5 px-10 flex items-center justify-between">
        <p className="text-xs text-muted">© 2025 Sun Asterisk Inc.</p>
        <p className="text-xs text-muted">SAA 2025 — Root Further</p>
      </footer>
    </div>
  );
}
