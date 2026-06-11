import { AwardCard } from "@/components/features/award-card";
import { AWARDS } from "@/lib/data/awards";
import { getTranslations } from "next-intl/server";

export async function AwardsGrid() {
  const t = await getTranslations("home");
  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold text-[#ffea9e] mb-10 text-center">
        {t("awardsTitle")}
      </h2>
      <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {AWARDS.map((award) => (
          <AwardCard key={award.slug} award={award} detailLabel={t("viewDetail")} />
        ))}
      </div>
    </section>
  );
}
