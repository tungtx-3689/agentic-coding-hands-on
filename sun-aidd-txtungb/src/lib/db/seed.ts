import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  profiles,
  departments,
  hashtags,
  kudos,
  kudoHashtags,
  kudoHearts,
  secretBoxes,
  awards,
} from "./schema";
import { AWARDS } from "../data/awards";

// ─── Static data ─────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { id: "dept-eng", name: "Engineering" },
  { id: "dept-design", name: "Design" },
  { id: "dept-product", name: "Product" },
];

const USERS = [
  { id: "user-1", name: "Nguyen Van An", email: "nguyen-van-an@sun-asterisk.com", dept: "dept-eng", role: "admin" as const },
  { id: "user-2", name: "Tran Thi Bich", email: "tran-thi-bich@sun-asterisk.com", dept: "dept-design", role: "user" as const },
  { id: "user-3", name: "Le Minh Cuong", email: "le-minh-cuong@sun-asterisk.com", dept: "dept-eng", role: "user" as const },
  { id: "user-4", name: "Pham Thi Dung", email: "pham-thi-dung@sun-asterisk.com", dept: "dept-product", role: "user" as const },
  { id: "user-5", name: "Hoang Van Em", email: "hoang-van-em@sun-asterisk.com", dept: "dept-design", role: "user" as const },
  { id: "user-6", name: "Nguyen Thi Phuong", email: "nguyen-thi-phuong@sun-asterisk.com", dept: "dept-eng", role: "user" as const },
  { id: "user-7", name: "Do Quang Huy", email: "do-quang-huy@sun-asterisk.com", dept: "dept-product", role: "user" as const },
  { id: "user-8", name: "Bui Thi Lan", email: "bui-thi-lan@sun-asterisk.com", dept: "dept-design", role: "user" as const },
];

const HASHTAGS = [
  { id: "tag-teamwork", name: "#teamwork" },
  { id: "tag-innovation", name: "#innovation" },
  { id: "tag-quality", name: "#quality" },
  { id: "tag-leadership", name: "#leadership" },
  { id: "tag-growth", name: "#growth" },
  { id: "tag-collaboration", name: "#collaboration" },
];

const KUDOS_DATA = [
  { s: "user-1", r: "user-2", content: "Cảm ơn bạn đã hỗ trợ thiết kế tuần này, rất chuyên nghiệp!", tags: ["tag-teamwork", "tag-quality"] },
  { s: "user-3", r: "user-4", content: "Bạn đã điều phối sprint rất tốt, team hiểu rõ hướng đi.", tags: ["tag-leadership"] },
  { s: "user-2", r: "user-1", content: "Cảm ơn anh đã review PR nhanh, giúp mình unblock.", tags: ["tag-teamwork"] },
  { s: "user-5", r: "user-6", content: "Đoạn code refactor của bạn rất sạch và dễ maintain.", tags: ["tag-quality", "tag-innovation"] },
  { s: "user-4", r: "user-7", content: "Bạn đã phân tích requirements rất kỹ, giúp tránh nhiều bug.", tags: ["tag-growth"] },
  { s: "user-6", r: "user-3", content: "Bạn luôn giải quyết vấn đề khó với thái độ bình tĩnh.", tags: ["tag-teamwork"], anon: "Một người hâm mộ" },
  { s: "user-7", r: "user-5", content: "UI/UX của bạn lần này đẹp lắm, user feedback rất tích cực.", tags: ["tag-innovation", "tag-quality"] },
  { s: "user-8", r: "user-2", content: "Cảm ơn bạn đã chia sẻ tài nguyên thiết kế, tiết kiệm rất nhiều thời gian.", tags: ["tag-collaboration"] },
  { s: "user-1", r: "user-6", content: "Bạn đã xử lý incident production rất nhanh, cả team yên tâm.", tags: ["tag-leadership", "tag-quality"] },
  { s: "user-3", r: "user-8", content: "Presentation của bạn hôm nay rất thuyết phục.", tags: ["tag-growth"] },
  { s: "user-2", r: "user-7", content: "Roadmap bạn lập rõ ràng và thực tế, dễ theo dõi.", tags: ["tag-leadership"] },
  { s: "user-6", r: "user-4", content: "Bạn luôn nắm bắt nhu cầu khách hàng rất tốt.", tags: ["tag-collaboration", "tag-growth"] },
  { s: "user-5", r: "user-1", content: "Anh đã mentor team rất nhiệt tình trong Q2.", tags: ["tag-leadership", "tag-teamwork"] },
  { s: "user-4", r: "user-3", content: "Bạn đã optimize query làm giảm 40% load time, ấn tượng!", tags: ["tag-innovation", "tag-quality"] },
  { s: "user-7", r: "user-6", content: "Cảm ơn bạn đã document API đầy đủ.", tags: ["tag-collaboration"] },
  { s: "user-8", r: "user-5", content: "Bạn có khiếu thẩm mỹ tuyệt vời, mỗi design đều rất tinh tế.", tags: ["tag-innovation"] },
  { s: "user-1", r: "user-4", content: "Bạn đã cân bằng giữa yêu cầu business và tech rất giỏi.", tags: ["tag-growth", "tag-leadership"] },
  { s: "user-3", r: "user-7", content: "Spec bạn viết chi tiết, giúp dev không bị mơ hồ.", tags: ["tag-quality"] },
  { s: "user-2", r: "user-8", content: "Bạn luôn vui vẻ và tạo không khí tốt cho team.", tags: ["tag-teamwork"], anon: "Đồng nghiệp ẩn danh" },
  { s: "user-6", r: "user-5", content: "Prototype bạn làm nhanh và đúng ý, tiết kiệm nhiều vòng lặp.", tags: ["tag-innovation", "tag-collaboration"] },
  { s: "user-4", r: "user-2", content: "Bạn đã giúp align design system giữa các team rất hiệu quả.", tags: ["tag-collaboration", "tag-quality"] },
  { s: "user-7", r: "user-1", content: "Anh đã đưa ra quyết định khó trong deadline rất bình tĩnh.", tags: ["tag-leadership"] },
  { s: "user-5", r: "user-3", content: "Bạn đã viết test coverage lên 80%, cả team yên tâm hơn nhiều.", tags: ["tag-quality", "tag-growth"] },
  { s: "user-8", r: "user-4", content: "Bạn phân tích competitor rất bài bản, insight rất hữu ích.", tags: ["tag-innovation"] },
  { s: "user-1", r: "user-3", content: "Code review của bạn luôn constructive và giúp cả team học được.", tags: ["tag-teamwork", "tag-growth"] },
];

// Hearts: kudo index 0-4 → user-3,user-4,user-5; 5-9 → user-1,user-2; 10-14 → user-6,user-7,user-8
const HEART_LIKERS: Record<number, string[]> = {
  0: ["user-3", "user-4", "user-5"],
  1: ["user-3", "user-4", "user-5"],
  2: ["user-3", "user-4", "user-5"],
  3: ["user-3", "user-4", "user-5"],
  4: ["user-3", "user-4", "user-5"],
  5: ["user-1", "user-2"],
  6: ["user-1", "user-2"],
  7: ["user-1", "user-2"],
  8: ["user-1", "user-2"],
  9: ["user-1", "user-2"],
  10: ["user-6", "user-7", "user-8"],
  11: ["user-6", "user-7", "user-8"],
  12: ["user-6", "user-7", "user-8"],
  13: ["user-6", "user-7", "user-8"],
  14: ["user-6", "user-7", "user-8"],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const existing = db.select().from(users).limit(1).all();
  if (existing.length > 0) {
    console.log("Already seeded — skipping.");
    return;
  }

  db.transaction((tx) => {
    tx.insert(departments).values(DEPARTMENTS).run();

    tx.insert(users).values(
      USERS.map((u) => ({ id: u.id, name: u.name, email: u.email, image: null }))
    ).run();

    tx.insert(profiles).values(
      USERS.map((u) => ({
        id: u.id,
        displayName: u.name,
        avatarUrl: null,
        departmentId: u.dept,
        role: u.role,
      }))
    ).run();

    tx.insert(hashtags).values(HASHTAGS).run();

    const now = Date.now();
    const kudoIds = KUDOS_DATA.map((_, i) => crypto.randomUUID());

    tx.insert(kudos).values(
      KUDOS_DATA.map((k, i) => ({
        id: kudoIds[i],
        senderId: k.s,
        receiverId: k.r,
        content: k.content,
        isAnonymous: !!k.anon,
        anonymousName: k.anon ?? null,
        createdAt: new Date(now - i * 3600000).toISOString(),
      }))
    ).run();

    const kudoHashtagRows = KUDOS_DATA.flatMap((k, i) =>
      k.tags.map((tagId) => ({ kudoId: kudoIds[i], hashtagId: tagId }))
    );
    tx.insert(kudoHashtags).values(kudoHashtagRows).run();

    const heartRows = Object.entries(HEART_LIKERS).flatMap(([idxStr, likers]) => {
      const idx = parseInt(idxStr, 10);
      return likers.map((userId) => ({ kudoId: kudoIds[idx], userId }));
    });
    tx.insert(kudoHearts).values(heartRows).run();

    tx.insert(secretBoxes).values([
      { id: crypto.randomUUID(), userId: "user-1", isOpened: false, rewardDescription: "Phần thưởng bí ẩn đang chờ bạn!" },
      { id: crypto.randomUUID(), userId: "user-2", isOpened: false, rewardDescription: "Một điều thú vị đang được cất giữ cho bạn." },
      { id: crypto.randomUUID(), userId: "user-3", isOpened: false, rewardDescription: "Bạn sắp nhận được điều gì đó đặc biệt." },
      { id: crypto.randomUUID(), userId: "user-3", isOpened: true, rewardDescription: "Voucher mua sắm 500,000 VND" },
    ]).run();

    tx.insert(awards).values(
      AWARDS.map((a) => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        count: a.count,
        value: a.value,
        imageUrl: a.image_url ?? null,
      }))
    ).run();
  });

  db.run(sql`UPDATE profiles SET kudos_received_count = (SELECT COUNT(*) FROM kudos WHERE receiver_id = profiles.id)`);
  db.run(sql`UPDATE profiles SET kudos_sent_count = (SELECT COUNT(*) FROM kudos WHERE sender_id = profiles.id)`);
  db.run(sql`UPDATE profiles SET hearts_received_count = (SELECT COUNT(*) FROM kudo_hearts kh JOIN kudos k ON k.id = kh.kudo_id WHERE k.receiver_id = profiles.id)`);

  console.log("✓ Seeded 3 departments, 8 users, 6 hashtags, 25 kudos, 6 awards, 4 secret boxes");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
