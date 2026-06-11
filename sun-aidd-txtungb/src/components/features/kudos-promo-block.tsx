import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function KudosPromoBlock() {
  const t = await getTranslations("home");
  return (
    <section className="py-16 border-t border-[#2e3940]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#ffea9e] mb-4">
            {t("kudosTitle")}
          </h2>
          <p className="text-[#999999] leading-relaxed max-w-xl">
            {t("kudosDesc")}
          </p>
        </div>
        <Link
          href="/kudos"
          className="shrink-0 border border-[#ffea9e] text-[#ffea9e] px-8 py-3 rounded-full hover:bg-[#ffea9e] hover:text-[#00101a] transition-colors duration-200 font-medium"
        >
          {t("viewDetail")} →
        </Link>
      </div>
    </section>
  );
}
