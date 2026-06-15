import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

interface KudosSidebarProps {
  userId: string;
}

export async function KudosSidebar({ userId }: KudosSidebarProps) {
  const t = await getTranslations("kudos");
  const supabase = await createClient();

  const [{ data: profile }, { count: boxCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("kudos_received_count, kudos_sent_count, hearts_received_count")
      .eq("id", userId)
      .single(),
    supabase
      .from("secret_boxes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_opened", false),
  ]);

  const stats = [
    { label: t("stats.received"), value: profile?.kudos_received_count ?? 0 },
    { label: t("stats.sent"), value: profile?.kudos_sent_count ?? 0 },
    { label: t("stats.hearts"), value: profile?.hearts_received_count ?? 0 },
    { label: t("stats.boxes"), value: boxCount ?? 0 },
  ];

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-6">
      {/* Personal stats */}
      <div className="bg-[#101417] border border-[#2e3940] rounded-xl p-5">
        <h3 className="text-[#ffea9e] font-semibold mb-4 text-sm uppercase tracking-widest">
          {t("yourStats")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-[#00070c] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-[#999999] mt-1">{label}</div>
            </div>
          ))}
        </div>
        {(boxCount ?? 0) > 0 && (
          <button className="mt-4 w-full bg-[#ffea9e] text-[#00101a] font-semibold py-2 rounded-full text-sm hover:bg-[#fff8e1] transition-colors">
            {t("openBox")} 🎁
          </button>
        )}
      </div>
    </aside>
  );
}
