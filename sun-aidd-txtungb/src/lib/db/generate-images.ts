import { db } from "./index";
import { awards, profiles } from "./schema";
import { eq } from "drizzle-orm";

function toDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ─── Award SVG templates ──────────────────────────────────────────────────────

const AWARD_ICONS: Record<string, string> = {
  "top-talent": `
    <polygon points="200,62 214,98 253,98 222,119 233,155 200,134 167,155 178,119 147,98 186,98"
      fill="#ffea9e" opacity="0.15" stroke="#ffea9e" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="200" cy="110" r="18" fill="#ffea9e" opacity="0.08"/>`,

  "top-project": `
    <polygon points="245,115 222,154 178,154 155,115 178,76 222,76"
      fill="#ffea9e" opacity="0.1" stroke="#ffea9e" stroke-width="1.5"/>
    <line x1="155" y1="115" x2="245" y2="115" stroke="#ffea9e" stroke-width="0.8" opacity="0.35"/>
    <line x1="178" y1="76" x2="222" y2="154" stroke="#ffea9e" stroke-width="0.8" opacity="0.35"/>
    <line x1="222" y1="76" x2="178" y2="154" stroke="#ffea9e" stroke-width="0.8" opacity="0.35"/>
    <circle cx="200" cy="115" r="8" fill="#ffea9e" opacity="0.3"/>`,

  "top-project-leader": `
    <path d="M155,152 L163,102 L189,127 L200,80 L211,127 L237,102 L245,152 Z"
      fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="154" y="152" width="92" height="9" rx="3" fill="#ffea9e" opacity="0.25"/>
    <circle cx="163" cy="102" r="5" fill="#ffea9e" opacity="0.8"/>
    <circle cx="200" cy="80" r="6" fill="#ffea9e" opacity="0.9"/>
    <circle cx="237" cy="102" r="5" fill="#ffea9e" opacity="0.8"/>`,

  "best-manager": `
    <circle cx="172" cy="90" r="21" fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.2"/>
    <path d="M133,152 Q140,124 156,115 L188,115 Q204,124 211,152Z"
      fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.2"/>
    <circle cx="228" cy="90" r="21" fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.2"/>
    <path d="M189,152 Q196,124 212,115 L244,115 Q260,124 267,152Z"
      fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.2"/>`,

  "signature-creator": `
    <path d="M242,74 L163,153 L152,167 L166,156 L245,77 Z"
      fill="#ffea9e" opacity="0.12" stroke="#ffea9e" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M226,74 L242,74 L242,90" fill="none" stroke="#ffea9e" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="157" cy="162" r="4" fill="#ffea9e" opacity="0.6"/>
    <line x1="158" y1="172" x2="242" y2="172" stroke="#ffea9e" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>`,

  "mvp": `
    <polygon points="200,68 252,110 200,178 148,110"
      fill="#ffea9e" opacity="0.1" stroke="#ffea9e" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="148" y1="110" x2="252" y2="110" stroke="#ffea9e" stroke-width="0.8" opacity="0.4"/>
    <line x1="200" y1="68" x2="148" y2="110" stroke="#ffea9e" stroke-width="0.8" opacity="0.25"/>
    <line x1="200" y1="68" x2="252" y2="110" stroke="#ffea9e" stroke-width="0.8" opacity="0.25"/>
    <line x1="200" y1="68" x2="200" y2="178" stroke="#ffea9e" stroke-width="0.8" opacity="0.25"/>
    <circle cx="200" cy="110" r="6" fill="#ffea9e" opacity="0.5"/>`,
};

function makeAwardSvg(title: string, slug: string): string {
  const icon = AWARD_ICONS[slug] ?? "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/><stop offset="100%" stop-color="#1a2330"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffea9e"/><stop offset="100%" stop-color="#c8a84b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="240" fill="url(#bg)" rx="12"/>
  <rect width="398" height="238" x="1" y="1" fill="none" stroke="#2e3940" stroke-width="1" rx="11"/>
  <rect x="175" y="14" width="50" height="1.5" fill="url(#gold)" rx="1" opacity="0.7"/>
  <circle cx="22" cy="22" r="3" fill="#ffea9e" opacity="0.12"/>
  <circle cx="378" cy="218" r="3" fill="#ffea9e" opacity="0.12"/>
  ${icon}
  <text x="200" y="215" text-anchor="middle" font-family="system-ui,Arial,sans-serif"
    font-size="15" font-weight="700" fill="#ffea9e" letter-spacing="1">${title}</text>
</svg>`;
}

// ─── Avatar SVG templates ─────────────────────────────────────────────────────

const USERS = [
  { id: "user-1", initials: "NA", female: false, from: "#0d1e35", to: "#1e3a58" },
  { id: "user-2", initials: "TB", female: true,  from: "#2d1020", to: "#4a1a35" },
  { id: "user-3", initials: "LC", female: false, from: "#0d2020", to: "#1a3838" },
  { id: "user-4", initials: "PD", female: true,  from: "#1e0d2d", to: "#341848" },
  { id: "user-5", initials: "HE", female: false, from: "#0d1428", to: "#1a2545" },
  { id: "user-6", initials: "NP", female: true,  from: "#250d1c", to: "#40182e" },
  { id: "user-7", initials: "DH", female: false, from: "#0d2015", to: "#1a3828" },
  { id: "user-8", initials: "BL", female: true,  from: "#100d28", to: "#1c1845" },
];

function makeAvatarSvg(initials: string, female: boolean, from: string, to: string): string {
  const bodyPath = female
    ? "M42,175 Q52,138 75,124 Q88,117 100,117 Q112,117 125,124 Q148,138 158,175Z"
    : "M38,175 Q48,136 74,122 Q87,115 100,115 Q113,115 126,122 Q152,136 162,175Z";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#g)"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#ffea9e" stroke-width="1" opacity="0.18"/>
  <circle cx="100" cy="80" r="30" fill="#ffea9e" opacity="0.18" clip-path="url(#c)"/>
  <path d="${bodyPath}" fill="#ffea9e" opacity="0.18" clip-path="url(#c)"/>
  <text x="100" y="87" text-anchor="middle" dominant-baseline="middle"
    font-family="system-ui,Arial,sans-serif" font-size="34" font-weight="800"
    fill="#ffea9e" opacity="0.85">${initials}</text>
</svg>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const awardRows = await db.select({ slug: awards.slug, title: awards.title }).from(awards);

  for (const { slug, title } of awardRows) {
    const dataUrl = toDataUrl(makeAwardSvg(title, slug));
    await db.update(awards).set({ imageUrl: dataUrl }).where(eq(awards.slug, slug));
    console.log(`✓ award: ${slug}`);
  }

  for (const u of USERS) {
    const dataUrl = toDataUrl(makeAvatarSvg(u.initials, u.female, u.from, u.to));
    await db.update(profiles).set({ avatarUrl: dataUrl }).where(eq(profiles.id, u.id));
    console.log(`✓ avatar: ${u.id} (${u.initials})`);
  }

  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
