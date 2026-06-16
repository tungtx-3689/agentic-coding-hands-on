import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("nav");

  return (
    <footer className="bg-[#0B0F12]/20 border-t border-divider">
      <div className="max-w-[1512px] mx-auto px-36 max-md:px-6 py-12 flex flex-col items-center gap-6">
        <span className="text-[#ffea9e] font-bold text-xl tracking-widest uppercase">
          SAA 2025
        </span>
        <nav className="flex gap-8">
          <Link
            href="/"
            className="text-[#999999] hover:text-white text-sm transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/awards"
            className="text-[#999999] hover:text-white text-sm transition-colors"
          >
            {t("awards")}
          </Link>
          <Link
            href="/kudos"
            className="text-[#999999] hover:text-white text-sm transition-colors"
          >
            {t("kudos")}
          </Link>
        </nav>
        <p className="text-[#999999] text-sm">© 2025 Sun Asterisk Inc.</p>
      </div>
    </footer>
  );
}
