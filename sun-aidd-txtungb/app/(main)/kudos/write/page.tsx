import { WriteKudoForm } from "@/components/features/kudos/write-kudo-form";
import { PageContainer } from "@/components/layout/page-container";
import { getHashtags } from "@/lib/kudos/actions";
import { getTranslations } from "next-intl/server";

export default async function WriteKudoPage() {
  const [t, hashtags] = await Promise.all([
    getTranslations("writeKudo"),
    getHashtags(),
  ]);

  return (
    <section className="py-14 min-h-[calc(100vh-80px)]">
      <PageContainer>
        <div className="max-w-xl mx-auto">
          <div className="bg-container border border-divider rounded-2xl p-8">
            <h1 className="text-xl font-bold text-primary mb-6">{t("title")}</h1>
            <WriteKudoForm hashtags={hashtags} />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
