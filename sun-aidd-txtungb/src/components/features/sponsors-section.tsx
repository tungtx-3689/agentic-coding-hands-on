import { getTranslations } from "next-intl/server";

const PARTNERS = [
  { name: "Amazon Web Services", short: "AWS", role: "Cloud" },
  { name: "Google Cloud", short: "GCP", role: "AI & Data" },
  { name: "Figma", short: "FIG", role: "Design" },
  { name: "GitHub", short: "GH", role: "Dev Platform" },
  { name: "Atlassian", short: "ATL", role: "Collaboration" },
  { name: "Slack", short: "SLK", role: "Communication" },
];

export async function SponsorsSection() {
  const t = await getTranslations("home");

  return (
    <section className="py-16 border-t border-divider">
      <div className="text-center mb-10">
        <h2 className="text-xl font-bold text-primary tracking-wide">{t("sponsorsTitle")}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {PARTNERS.map((p) => (
          <div
            key={p.name}
            className="flex flex-col items-center gap-2 bg-container border border-divider rounded-xl py-5 px-3 hover:border-border transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-container-2 border border-divider flex items-center justify-center">
              <span className="text-xs font-bold text-primary tracking-widest">{p.short}</span>
            </div>
            <span className="text-xs text-muted text-center">{p.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
