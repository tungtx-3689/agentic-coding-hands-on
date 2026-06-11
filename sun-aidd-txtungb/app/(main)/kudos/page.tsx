import { KudosTabs } from "@/components/features/kudos/kudos-tabs";
import { KudosSidebar } from "@/components/features/kudos/kudos-sidebar";
import { KudosHighlightCarousel } from "@/components/features/kudos/kudos-highlight-carousel";
import { PageContainer } from "@/components/layout/page-container";
import { WidgetButton } from "@/components/ui/widget-button";
import { createClient } from "@/lib/supabase/server";
import type { Hashtag, Kudo } from "@/lib/types";
import { getTranslations } from "next-intl/server";

const PAGE_SIZE = 10;

export default async function KudosPage() {
  const t = await getTranslations("kudos");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: kudosData },
    { data: hashtags },
    { data: departments },
    { data: spotlightProfiles },
  ] = await Promise.all([
    supabase
      .from("kudos")
      .select(
        `id, sender_id, receiver_id, content, is_anonymous, anonymous_name, created_at,
         sender:profiles!kudos_sender_id_fkey(id, display_name, avatar_url, kudos_received_count),
         receiver:profiles!kudos_receiver_id_fkey(id, display_name, avatar_url, kudos_received_count),
         hashtags:kudo_hashtags(hashtag:hashtags(id, name)),
         kudo_hearts(count)`
      )
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1),
    supabase.from("hashtags").select("id, name").order("name"),
    supabase.from("departments").select("id, name").order("name"),
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, kudos_received_count")
      .order("kudos_received_count", { ascending: false })
      .limit(10),
  ]);

  const initialKudos: Kudo[] = (kudosData ?? []).map((row: any) => ({
    ...(row as Omit<typeof row, "hashtags" | "kudo_hearts">),
    hashtags: (row.hashtags as unknown as { hashtag: Hashtag }[]).map(
      (h) => h.hashtag
    ),
    heart_count: (row.kudo_hearts as { count: number }[]).reduce(
      (s, h) => s + h.count,
      0
    ),
    user_has_liked: user
      ? (row.kudo_hearts as { count: number }[]).length > 0
      : false,
  })) as unknown as Kudo[];

  return (
    <>
      <section className="bg-bg border-b border-divider py-14">
        <PageContainer>
          <div className="flex flex-col items-center text-center gap-3">
            <h1 className="text-4xl font-bold text-primary tracking-wide">
              {t("heroTitle")}
            </h1>
            <p className="text-muted text-sm">{t("pageTitle")}</p>
          </div>
        </PageContainer>
      </section>

      {initialKudos.length > 0 && (
        <div className="border-b border-divider">
          <PageContainer>
            <div className="py-6">
              <KudosHighlightCarousel kudos={initialKudos.slice(0, 5)} />
            </div>
          </PageContainer>
        </div>
      )}

      <PageContainer>
        <div className="py-10 flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            <KudosTabs
              initialKudos={initialKudos}
              hashtags={hashtags ?? []}
              departments={departments ?? []}
              currentUserId={user?.id}
              spotlightProfiles={spotlightProfiles ?? []}
            />
          </div>

          {user && <KudosSidebar userId={user.id} />}
        </div>
      </PageContainer>

      <WidgetButton />
    </>
  );
}
