import { AwardSection } from "@/components/features/award-section";
import { AwardsLeftNav } from "@/components/features/awards-left-nav";
import { KudosPromoBlock } from "@/components/features/kudos-promo-block";
import { KeyVisualSection } from "@/components/layout/keyvisual-section";
import { PageContainer } from "@/components/layout/page-container";
import { getAwards } from "@/lib/db/queries/awards";
import { getTopProfiles } from "@/lib/db/queries/profiles";
import { getTranslations } from "next-intl/server";

export default async function AwardsPage() {
  const t = await getTranslations("awards");
  const [awards, topTalent] = await Promise.all([getAwards(), getTopProfiles(5)]);

  const navItems = awards.map((a) => ({
    id: a.slug,
    label: t(`categories.${a.slug}` as Parameters<typeof t>[0]),
  }));

  return (
    <>
      <KeyVisualSection banner>
        <PageContainer>
          <div className="pt-8 pb-4 flex flex-col items-start gap-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">SAA 2025</p>
            <h1 className="text-3xl font-bold text-primary tracking-wide">{t("pageTitle")}</h1>
          </div>
        </PageContainer>
      </KeyVisualSection>

      <PageContainer>
        <div className="flex gap-16 py-12">
          <aside className="hidden lg:block w-52 shrink-0">
            <AwardsLeftNav items={navItems} />
          </aside>

          <div className="flex-1 min-w-0">
            {awards.map((award) => (
              <AwardSection key={award.slug} award={award} />
            ))}

            {topTalent.length > 0 && (
              <section className="py-12 border-b border-divider">
                <h2 className="text-xl font-bold text-primary mb-6">{t("topKudosTitle")}</h2>
                <div className="flex flex-col gap-2">
                  {topTalent.map((profile, i) => (
                    <div
                      key={profile.id}
                      className="flex items-center gap-3 bg-container border border-divider rounded-xl px-4 py-3 hover:border-border transition-colors"
                    >
                      <span className="text-sm font-bold text-muted w-6 shrink-0">#{i + 1}</span>
                      <div className="w-9 h-9 rounded-full bg-divider flex items-center justify-center text-sm font-semibold text-primary overflow-hidden shrink-0">
                        {profile.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (profile.display_name ?? "?")[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-sm text-text flex-1 min-w-0 truncate">{profile.display_name}</span>
                      <span className="text-xs text-muted shrink-0">{profile.kudos_received_count} kudos</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <KudosPromoBlock />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
