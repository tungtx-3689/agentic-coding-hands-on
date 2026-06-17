import { KudoCard } from "@/components/features/kudos/kudo-card";
import { PageContainer } from "@/components/layout/page-container";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { getKudoById } from "@/lib/db/queries/kudos";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function KudoDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();
  const kudo = await getKudoById(id, user?.id);

  if (!kudo) notFound();

  return (
    <PageContainer>
      <div className="py-10 max-w-xl mx-auto flex flex-col gap-6">
        <Link
          href="/kudos"
          className="text-sm text-muted hover:text-text transition-colors w-fit"
        >
          ← Quay lại Kudos
        </Link>
        <KudoCard kudo={kudo} currentUserId={user?.id} />
      </div>
    </PageContainer>
  );
}
