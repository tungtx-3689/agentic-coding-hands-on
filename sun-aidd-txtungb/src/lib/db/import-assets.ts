import fs from "fs";
import path from "path";
import { db } from "./index";
import { awards, profiles } from "./schema";
import { eq } from "drizzle-orm";

const ASSETS_DIR = path.join(process.cwd(), "assets");
const AWARD_DIR = path.join(ASSETS_DIR, "award");
const AVATAR_DIR = path.join(ASSETS_DIR, "avatar");

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

function toDataUrl(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = MIME[ext] ?? "image/png";
  const data = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${data}`;
}

function importDir(dir: string, handler: (slug: string, dataUrl: string) => void) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file.startsWith(".")) continue;
    const slug = path.basename(file, path.extname(file));
    handler(slug, toDataUrl(path.join(dir, file)));
  }
}

async function main() {
  let count = 0;

  // Award images — filename slug must match awards.slug (e.g. top-talent.png)
  importDir(AWARD_DIR, async (slug, dataUrl) => {
    await db.update(awards).set({ imageUrl: dataUrl }).where(eq(awards.slug, slug));
    console.log(`✓ award/${slug}`);
    count++;
  });

  // Avatar images — filename must match profiles.id (e.g. user-1.png)
  importDir(AVATAR_DIR, async (userId, dataUrl) => {
    await db.update(profiles).set({ avatarUrl: dataUrl }).where(eq(profiles.id, userId));
    console.log(`✓ avatar/${userId}`);
    count++;
  });

  console.log(`\nDone — ${count} image(s) imported.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
