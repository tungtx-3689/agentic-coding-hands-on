import { KudosTabs } from "@/components/features/kudos/kudos-tabs";
import { KudosSidebar } from "@/components/features/kudos/kudos-sidebar";
import { KudosHighlightCarousel } from "@/components/features/kudos/kudos-highlight-carousel";
import { KeyVisualSection } from "@/components/layout/keyvisual-section";
import { PageContainer } from "@/components/layout/page-container";
import { WidgetButton } from "@/components/ui/widget-button";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { getKudos } from "@/lib/db/queries/kudos";
import { getHashtags } from "@/lib/db/queries/hashtags";
import { getDepartments } from "@/lib/db/queries/departments";
import { getTopProfiles } from "@/lib/db/queries/profiles";
import { getTranslations } from "next-intl/server";

const PAGE_SIZE = 10;

export default async function KudosPage() {
  const t = await getTranslations("kudos");
  const user = await getSessionUser();

  const [initialKudos, hashtags, departments, spotlightProfiles] =
    await Promise.all([
      getKudos({ page: 1, pageSize: PAGE_SIZE, currentUserId: user?.id }),
      getHashtags(),
      getDepartments(),
      getTopProfiles(10),
    ]);

  return (
    <>
      <KeyVisualSection>
        <PageContainer>
          <div className="py-6 flex flex-col items-start gap-2">
            <p className="text-primary font-bold text-base">{t("heroTitle")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/aidd-kudos-logo.png" alt="Sun* Kudos" className="h-14 w-auto" />
          </div>
        </PageContainer>
      </KeyVisualSection>

      {initialKudos.length > 0 && (
        <div className="border-b border-divider">
          <PageContainer>
            <div className="py-6">
              <KudosHighlightCarousel kudos={initialKudos.slice(0, 5)} currentUserId={user?.id} />
            </div>
          </PageContainer>
        </div>
      )}

      <PageContainer>
        <div className="py-10 flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            <KudosTabs
              initialKudos={initialKudos}
              hashtags={hashtags}
              departments={departments}
              currentUserId={user?.id}
              spotlightProfiles={spotlightProfiles}
            />
          </div>
          {user && <KudosSidebar userId={user.id} />}
        </div>
      </PageContainer>

      <WidgetButton />
    </>
  );
}
