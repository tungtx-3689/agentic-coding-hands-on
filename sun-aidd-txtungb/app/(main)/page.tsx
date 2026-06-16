import { AwardsGrid } from "@/components/features/awards-grid";
import { CountdownTimer } from "@/components/features/countdown-timer";
import { KudosPromoBlock } from "@/components/features/kudos-promo-block";
import { SponsorsSection } from "@/components/features/sponsors-section";
import { KeyVisualSection } from "@/components/layout/keyvisual-section";
import { PageContainer } from "@/components/layout/page-container";
import { WidgetButton } from "@/components/ui/widget-button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      {/* Hero section with keyvisual background */}
      <KeyVisualSection>
        <PageContainer>
          <div className="py-24 flex flex-col items-center text-center gap-8">
            <h1 className="text-6xl md:text-8xl font-bold text-primary tracking-widest">
              ROOT FURTHER
            </h1>

            <div className="flex flex-col items-center gap-2 text-muted text-sm">
              <span>{t("eventTime")} · {t("eventVenue")}</span>
            </div>

            <CountdownTimer />

            <div className="flex items-center gap-4 mt-4">
              <Link
                href="/awards"
                className="bg-primary text-bg font-semibold px-8 py-3 rounded-full hover:bg-btn-hover transition-colors duration-200"
              >
                {t("aboutAwards")}
              </Link>
              <Link
                href="/kudos"
                className="border border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-bg transition-colors duration-200"
              >
                {t("aboutKudos")}
              </Link>
            </div>
          </div>
        </PageContainer>
      </KeyVisualSection>

      {/* Root Further content */}
      <section className="py-20 bg-container-2">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Root Further</h2>
            <p className="text-muted leading-relaxed text-lg">
              Sun Asterisk Awards 2025 — Sự kiện thường niên tôn vinh những cá nhân và dự án
              xuất sắc, những người đã và đang góp phần xây dựng một Sun* ngày càng vững mạnh.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Awards grid */}
      <PageContainer>
        <AwardsGrid />
        <KudosPromoBlock />
        <SponsorsSection />
      </PageContainer>

      <WidgetButton />
    </>
  );
}
