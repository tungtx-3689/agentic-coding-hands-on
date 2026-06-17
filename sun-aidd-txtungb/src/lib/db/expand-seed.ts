import { db } from "./index";
import { users, profiles, departments, kudos, kudoHashtags, kudoHearts } from "./schema";

function computeTitle(n: number): string | null {
  if (n >= 21) return "Legend Hero";
  if (n >= 10) return "Super Hero";
  if (n >= 5)  return "Rising Hero";
  if (n >= 1)  return "New Hero";
  return null;
}

// ─── New departments ──────────────────────────────────────────────────────────

const NEW_DEPARTMENTS = [
  { id: "dept-marketing", name: "Marketing" },
  { id: "dept-qa",        name: "QA" },
  { id: "dept-devops",    name: "DevOps" },
  { id: "dept-hr",        name: "HR" },
  { id: "dept-sales",     name: "Sales" },
];

// ─── 10 new users ────────────────────────────────────────────────────────────

const NEW_USERS = [
  { id: "user-9",  name: "Vo Thi Huong",      email: "vo-thi-huong@sun-asterisk.com",      dept: "dept-marketing", role: "user" as const },
  { id: "user-10", name: "Nguyen Duc Anh",     email: "nguyen-duc-anh@sun-asterisk.com",    dept: "dept-qa",        role: "user" as const },
  { id: "user-11", name: "Pham Thi Thu",       email: "pham-thi-thu@sun-asterisk.com",      dept: "dept-devops",    role: "user" as const },
  { id: "user-12", name: "Tran Quoc Bao",      email: "tran-quoc-bao@sun-asterisk.com",     dept: "dept-hr",        role: "user" as const },
  { id: "user-13", name: "Le Thi Mai",         email: "le-thi-mai@sun-asterisk.com",        dept: "dept-sales",     role: "user" as const },
  { id: "user-14", name: "Dang Van Khanh",     email: "dang-van-khanh@sun-asterisk.com",    dept: "dept-marketing", role: "user" as const },
  { id: "user-15", name: "Nguyen Thi Ngoc",    email: "nguyen-thi-ngoc@sun-asterisk.com",   dept: "dept-qa",        role: "user" as const },
  { id: "user-16", name: "Hoang Minh Tuan",    email: "hoang-minh-tuan@sun-asterisk.com",   dept: "dept-devops",    role: "user" as const },
  { id: "user-17", name: "Bui Thi Thanh",      email: "bui-thi-thanh@sun-asterisk.com",     dept: "dept-hr",        role: "user" as const },
  { id: "user-18", name: "Do Xuan Long",       email: "do-xuan-long@sun-asterisk.com",      dept: "dept-sales",     role: "user" as const },
];

// ─── Titles for existing 25 kudos ────────────────────────────────────────────

const EXISTING_TITLES = [
  "Cảm ơn hỗ trợ thiết kế xuất sắc",
  "Sprint coordination tuyệt vời",
  "Review PR siêu tốc",
  "Code refactor chuẩn mực",
  "Phân tích requirements kỹ lưỡng",
  "Giải quyết vấn đề bình tĩnh",
  "UI/UX ấn tượng lần này",
  "Chia sẻ tài nguyên rất nhiệt tình",
  "Xử lý incident nhanh nhẹn",
  "Presentation thuyết phục",
  "Roadmap rõ ràng và thực tế",
  "Nắm bắt nhu cầu khách hàng",
  "Mentor nhiệt tình trong Q2",
  "Optimize query giảm 40% load time",
  "Document API đầy đủ và chuẩn",
  "Thẩm mỹ thiết kế tuyệt vời",
  "Cân bằng business và tech giỏi",
  "Spec chi tiết, không mơ hồ",
  "Tinh thần team tích cực",
  "Prototype nhanh và đúng ý",
  "Align design system hiệu quả",
  "Quyết định bình tĩnh dưới áp lực",
  "Test coverage 80% thật ấn tượng",
  "Phân tích competitor rất bài bản",
  "Code review luôn constructive",
];

// ─── 60 new kudos ────────────────────────────────────────────────────────────

const ALL_USER_IDS = [
  "user-1","user-2","user-3","user-4","user-5","user-6","user-7","user-8",
  "user-9","user-10","user-11","user-12","user-13","user-14","user-15","user-16","user-17","user-18",
];

const TAG_IDS = ["tag-teamwork","tag-innovation","tag-quality","tag-leadership","tag-growth","tag-collaboration"];

const NEW_KUDOS: Array<{ s: string; r: string; title: string; content: string; tags: string[]; anon?: string }> = [
  { s:"user-9",  r:"user-1",  title:"Lãnh đạo truyền cảm hứng",       content:"Anh luôn tạo ra không gian để team dám thử nghiệm và học hỏi. Cảm ơn sự dẫn dắt đầy truyền cảm hứng!", tags:["tag-leadership","tag-growth"] },
  { s:"user-10", r:"user-2",  title:"Thiết kế tinh tế, chi tiết",      content:"Bạn luôn chú ý đến từng pixel nhỏ, kết quả là sản phẩm đẹp và trải nghiệm người dùng vượt kỳ vọng.", tags:["tag-quality","tag-innovation"] },
  { s:"user-11", r:"user-3",  title:"Đồng hành lúc hệ thống sập",     content:"Lúc 2 giờ sáng hệ thống có vấn đề, bạn vẫn online hỗ trợ không do dự. Cảm ơn rất nhiều!", tags:["tag-teamwork"] },
  { s:"user-12", r:"user-4",  title:"Onboarding tận tâm",             content:"Bạn đã giúp team mới hòa nhập nhanh chóng, quy trình onboarding bạn xây dựng rất hiệu quả.", tags:["tag-collaboration","tag-growth"] },
  { s:"user-13", r:"user-5",  title:"UI flow cực kỳ trơn tru",        content:"Flow người dùng bạn thiết kế lần này rất tự nhiên, khách hàng phản hồi tích cực ngay lập tức.", tags:["tag-innovation","tag-quality"] },
  { s:"user-14", r:"user-6",  title:"Hỗ trợ deploy không mệt mỏi",    content:"Mỗi lần release, bạn luôn ở đó support. Sự kiên nhẫn và kỹ năng của bạn thật đáng nể.", tags:["tag-teamwork","tag-quality"] },
  { s:"user-15", r:"user-7",  title:"Phân tích gap tuyệt vời",        content:"Bạn phát hiện ra gap giữa requirement và thực tế sớm hơn bất kỳ ai, giúp team tránh nhiều rủi ro.", tags:["tag-leadership","tag-innovation"] },
  { s:"user-16", r:"user-8",  title:"Kỹ năng thuyết trình ấn tượng",  content:"Cách bạn trình bày ý tưởng rõ ràng và cuốn hút, stakeholder hiểu ngay từ lần đầu.", tags:["tag-collaboration"] },
  { s:"user-17", r:"user-9",  title:"Chiến dịch marketing sáng tạo",  content:"Campaign bạn lên kế hoạch lần này rất sáng tạo và phù hợp target audience. Kết quả vượt KPI!", tags:["tag-innovation","tag-growth"] },
  { s:"user-18", r:"user-10", title:"QA kỹ lưỡng, bug-free release",  content:"Nhờ quy trình test chặt chẽ của bạn, release lần này zero critical bug. Thật ấn tượng!", tags:["tag-quality","tag-teamwork"] },
  { s:"user-1",  r:"user-11", title:"Deploy tự tin, không lo downtime", content:"Pipeline CI/CD bạn thiết lập rất solid, cả team deploy không còn phải hồi hộp nữa.", tags:["tag-innovation","tag-quality"] },
  { s:"user-2",  r:"user-12", title:"Xây dựng văn hóa team tốt",      content:"Các hoạt động team building bạn tổ chức giúp mọi người kết nối hơn rất nhiều. Cảm ơn bạn!", tags:["tag-teamwork","tag-collaboration"] },
  { s:"user-3",  r:"user-13", title:"Bán hàng với tâm huyết",         content:"Cách bạn lắng nghe và hiểu nhu cầu khách hàng trước khi đề xuất giải pháp rất chuyên nghiệp.", tags:["tag-growth"] },
  { s:"user-4",  r:"user-14", title:"Content marketing chất lượng cao", content:"Bài viết bạn sản xuất không chỉ thu hút mà còn tạo giá trị thực cho người đọc.", tags:["tag-quality","tag-innovation"] },
  { s:"user-5",  r:"user-15", title:"Automation test tiết kiệm thời gian", content:"Script test automation bạn viết tiết kiệm cho team hàng chục giờ mỗi sprint.", tags:["tag-innovation","tag-growth"] },
  { s:"user-6",  r:"user-16", title:"Infrastructure vững chắc",        content:"Hệ thống bạn thiết kế uptime 99.9%, cả team yên tâm tập trung vào feature development.", tags:["tag-quality","tag-leadership"] },
  { s:"user-7",  r:"user-17", title:"Giải quyết conflict khéo léo",    content:"Bạn đã hóa giải một mâu thuẫn nhạy cảm trong team rất tinh tế, không ai bị tổn thương.", tags:["tag-teamwork","tag-collaboration"] },
  { s:"user-8",  r:"user-18", title:"Đàm phán hợp đồng xuất sắc",     content:"Nhờ kỹ năng đàm phán của bạn, chúng ta ký được hợp đồng với điều khoản rất có lợi.", tags:["tag-leadership","tag-growth"] },
  { s:"user-9",  r:"user-3",  title:"Backend vững như bàn thạch",      content:"API bạn thiết kế clean, well-documented và performance tốt. Là nền tảng vững cho toàn product.", tags:["tag-quality","tag-innovation"] },
  { s:"user-10", r:"user-5",  title:"Thiết kế dễ test, dễ validate",  content:"Component bạn build tách biệt rõ ràng, viết test rất dễ. Cảm ơn bạn đã nghĩ đến QA!", tags:["tag-teamwork","tag-quality"] },
  { s:"user-11", r:"user-1",  title:"Mentor kỹ thuật tận tụy",         content:"Những buổi tech talk bạn chia sẻ giúp cả team DevOps nâng cao trình độ rất nhanh.", tags:["tag-leadership","tag-growth"] },
  { s:"user-12", r:"user-2",  title:"Design system nhất quán",         content:"Design system bạn duy trì giúp toàn công ty có hình ảnh thương hiệu đồng nhất và chuyên nghiệp.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-13", r:"user-4",  title:"Roadmap sản phẩm tầm nhìn xa",   content:"Roadmap bạn xây dựng phản ánh đúng nhu cầu thị trường và có tầm nhìn dài hạn rõ ràng.", tags:["tag-leadership","tag-growth"] },
  { s:"user-14", r:"user-6",  title:"Hệ thống monitoring hoàn hảo",   content:"Dashboard monitoring bạn dựng giúp team phát hiện và xử lý vấn đề trước khi user biết.", tags:["tag-quality","tag-innovation"] },
  { s:"user-15", r:"user-7",  title:"Acceptance criteria cực rõ ràng", content:"AC bạn viết không bao giờ mơ hồ, tester và developer đều hiểu ngay mà không cần hỏi thêm.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-16", r:"user-8",  title:"Training nội bộ chất lượng cao",  content:"Buổi training về kỹ năng thuyết trình bạn tổ chức rất thực tế và hữu ích cho cả team.", tags:["tag-growth","tag-teamwork"] },
  { s:"user-17", r:"user-9",  title:"Chiến lược content dài hạn",      content:"Kế hoạch content 6 tháng bạn lập rất bài bản, kết hợp nhuần nhuyễn giữa SEO và branding.", tags:["tag-innovation","tag-leadership"] },
  { s:"user-18", r:"user-10", title:"Test plan toàn diện",              content:"Test plan bạn viết cover được mọi edge case, giúp sản phẩm ra mắt với chất lượng cao nhất.", tags:["tag-quality","tag-growth"] },
  { s:"user-1",  r:"user-9",  title:"Đồng đội marketing tuyệt vời",    content:"Chiến dịch lần này nhờ bạn mà brand awareness tăng vọt. Cảm ơn sự sáng tạo không ngừng!", tags:["tag-innovation","tag-teamwork"] },
  { s:"user-2",  r:"user-10", title:"QA partner đáng tin cậy",         content:"Bạn luôn phát hiện bug trước khi lên production, là lá chắn bảo vệ chất lượng sản phẩm.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-3",  r:"user-11", title:"CI/CD pipeline chuyên nghiệp",    content:"Flow deploy bạn xây dựng giúp release cycle từ 2 tuần xuống còn 2 ngày. Thật impressive!", tags:["tag-innovation","tag-quality"] },
  { s:"user-4",  r:"user-12", title:"Văn hóa công ty ngày càng tốt",   content:"Các sáng kiến HR của bạn giúp môi trường làm việc ngày càng tích cực và sáng tạo hơn.", tags:["tag-teamwork","tag-growth"] },
  { s:"user-5",  r:"user-13", title:"Chốt deal nhanh và hiệu quả",     content:"Khả năng xây dựng niềm tin với khách hàng của bạn thật sự đặc biệt. Tỷ lệ chuyển đổi cao!", tags:["tag-growth","tag-leadership"] },
  { s:"user-6",  r:"user-14", title:"Viral content đúng thời điểm",    content:"Bài đăng bạn tạo ra lan truyền tự nhiên, đúng trend và mang lại lượt tiếp cận khổng lồ.", tags:["tag-innovation"] },
  { s:"user-7",  r:"user-15", title:"Bug triage thần tốc",              content:"Bạn phân loại và ưu tiên bug cực nhanh, giúp team dev focus vào đúng vấn đề quan trọng nhất.", tags:["tag-leadership","tag-quality"] },
  { s:"user-8",  r:"user-16", title:"Zero downtime deployment",         content:"Kỹ thuật blue-green deploy bạn áp dụng giúp update lớn mà user không hề hay biết. Xuất sắc!", tags:["tag-innovation","tag-quality"] },
  { s:"user-9",  r:"user-17", title:"Chăm sóc employee tận tâm",        content:"Bạn luôn nhớ những điều nhỏ nhặt với từng thành viên, tạo ra bầu không khí ấm áp.", tags:["tag-teamwork","tag-collaboration"] },
  { s:"user-10", r:"user-18", title:"Đối tác chiến lược tốt",          content:"Cách bạn xây dựng quan hệ đối tác dài hạn rất bền vững, mang lại giá trị cho cả hai phía.", tags:["tag-growth","tag-leadership"] },
  { s:"user-11", r:"user-2",  title:"Components tái sử dụng chuẩn",    content:"Design tokens và component library bạn xây dựng giúp develop nhanh gấp đôi, đồng thời đẹp hơn.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-12", r:"user-3",  title:"Mentoring team mới hiệu quả",      content:"Bạn dành nhiều thời gian để guide team mới, kiên nhẫn giải thích từng chi tiết kỹ thuật.", tags:["tag-teamwork","tag-growth"] },
  { s:"user-13", r:"user-5",  title:"Bán hàng dựa trên UX research",   content:"Bạn sử dụng data từ UX research để thuyết phục khách hàng rất hiệu quả và có căn cứ.", tags:["tag-innovation","tag-quality"] },
  { s:"user-14", r:"user-7",  title:"Storytelling sản phẩm xuất sắc",  content:"Bạn biến những tính năng kỹ thuật phức tạp thành câu chuyện hấp dẫn cho khách hàng.", tags:["tag-innovation","tag-leadership"] },
  { s:"user-15", r:"user-4",  title:"Định nghĩa done rõ ràng",         content:"Bạn làm rõ Definition of Done giúp cả team hiểu khi nào một task thực sự hoàn thành.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-16", r:"user-1",  title:"Architecture quyết định sáng suốt", content:"Quyết định chọn kiến trúc microservice của bạn đã giúp hệ thống scale dễ dàng gấp nhiều lần.", tags:["tag-leadership","tag-innovation"] },
  { s:"user-17", r:"user-6",  title:"Hỗ trợ onboarding kỹ thuật",     content:"Bạn giúp nhân viên mới làm quen với hạ tầng rất nhanh, tài liệu onboarding bạn viết rất rõ.", tags:["tag-teamwork","tag-quality"] },
  { s:"user-18", r:"user-8",  title:"Presentation skills đỉnh cao",    content:"Bài thuyết trình của bạn trước hội đồng quản trị vừa chuyên nghiệp vừa thuyết phục. Bravo!", tags:["tag-leadership","tag-growth"] },
  { s:"user-1",  r:"user-15", title:"Testing mindset truyền cảm hứng", content:"Bạn lan toa văn hóa chất lượng trong cả team, mọi người đều ý thức hơn về test coverage.", tags:["tag-quality","tag-growth"] },
  { s:"user-2",  r:"user-16", title:"DevOps collaboration mượt mà",    content:"Bạn luôn sẵn sàng hỗ trợ setup môi trường, giúp designer và developer làm việc không bị block.", tags:["tag-teamwork","tag-collaboration"] },
  { s:"user-3",  r:"user-17", title:"Đồng hành lúc khó khăn",         content:"Bạn luôn ở đó khi team cần, không chỉ về công việc mà cả về tinh thần. Cảm ơn bạn nhiều!", tags:["tag-teamwork"] },
  { s:"user-4",  r:"user-18", title:"Partnership management xuất sắc", content:"Bạn duy trì mối quan hệ với đối tác rất chuyên nghiệp, luôn win-win cho cả hai phía.", tags:["tag-collaboration","tag-growth"] },
  { s:"user-5",  r:"user-9",  title:"Brand identity nhất quán",        content:"Bạn bảo vệ và phát triển brand identity rất tốt, mọi touchpoint đều phản ánh đúng giá trị brand.", tags:["tag-quality","tag-innovation"] },
  { s:"user-6",  r:"user-10", title:"Automation testing chất lượng",   content:"Coverage test bạn viết comprehensive, giúp detect regression ngay khi có thay đổi nhỏ nhất.", tags:["tag-quality","tag-teamwork"] },
  { s:"user-7",  r:"user-11", title:"Release management không lỗi",     content:"Quy trình release bạn thiết lập giúp mọi deployment suôn sẻ, không bao giờ bị surprise.", tags:["tag-quality","tag-leadership"] },
  { s:"user-8",  r:"user-12", title:"Employee engagement cao",          content:"Survey engagement tăng mạnh kể từ khi bạn phụ trách HR. Mọi người yêu thích môi trường này hơn!", tags:["tag-growth","tag-collaboration"] },
  { s:"user-9",  r:"user-4",  title:"Product vision rõ nét",           content:"Bạn truyền đạt product vision đến toàn team rất rõ ràng, ai cũng hiểu mình đang build gì và tại sao.", tags:["tag-leadership"] },
  { s:"user-10", r:"user-6",  title:"Hạ tầng đáng tin cậy",           content:"Hệ thống bạn vận hành chưa bao giờ gây ra incident nghiêm trọng. Sự ổn định này là nền tảng cho mọi thứ.", tags:["tag-quality","tag-teamwork"] },
  { s:"user-11", r:"user-5",  title:"Figma to code cực nhanh",         content:"Design bạn xuất Figma cực kỳ chuẩn xác, developer implement không cần hỏi thêm, tiết kiệm nhiều thời gian.", tags:["tag-quality","tag-collaboration"] },
  { s:"user-12", r:"user-7",  title:"OKR alignment tuyệt vời",        content:"Bạn kết nối OKR của team với company goals rất chặt, mọi người hiểu rõ contribution của mình.", tags:["tag-leadership","tag-growth"] },
  { s:"user-13", r:"user-6",  title:"SLA cam kết vượt kỳ vọng",       content:"Hạ tầng bạn quản lý không chỉ đáp ứng mà vượt SLA mà team cam kết với khách hàng.", tags:["tag-quality"] },
  { s:"user-14", r:"user-3",  title:"Technical blog truyền cảm hứng", content:"Bài kỹ thuật bạn viết cho blog công ty không chỉ chất lượng cao mà còn thu hút nhiều talent.", tags:["tag-innovation","tag-growth"] },
  { s:"user-15", r:"user-2",  title:"Figma component library chuẩn",  content:"Library bạn xây dựng có documentation rõ ràng, QA và dev đều dùng được, rất chuyên nghiệp.", tags:["tag-quality","tag-collaboration"] },
];

// ─── Varied heart counts per new kudo ────────────────────────────────────────

const HEART_COUNTS = [
  12, 7, 15, 3, 9, 1, 18, 5, 11, 2,
  14, 6, 8, 20, 4, 13, 0, 16, 7, 3,
  10, 5, 17, 1, 9, 22, 6, 11, 4, 14,
  8, 19, 2, 7, 12, 5, 16, 3, 9, 1,
  13, 6, 21, 4, 10, 7, 15, 2, 8, 11,
  5, 18, 3, 14, 6, 9, 1, 12, 7, 4,
];

function heartLikers(kudoIdx: number, count: number): string[] {
  const likers: string[] = [];
  for (let i = 0; i < count; i++) {
    const uid = ALL_USER_IDS[(kudoIdx + i + 1) % ALL_USER_IDS.length];
    const kudo = NEW_KUDOS[kudoIdx];
    if (uid !== kudo.s && uid !== kudo.r && !likers.includes(uid)) {
      likers.push(uid);
    } else {
      const alt = ALL_USER_IDS[(kudoIdx + i + 3) % ALL_USER_IDS.length];
      if (alt !== kudo.s && alt !== kudo.r && !likers.includes(alt)) {
        likers.push(alt);
      }
    }
  }
  return likers;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Update existing kudos with titles
  const existing = db.$client.prepare(
    "SELECT id FROM kudos ORDER BY created_at DESC LIMIT 25"
  ).all() as { id: string }[];

  for (let i = 0; i < existing.length && i < EXISTING_TITLES.length; i++) {
    db.$client.prepare("UPDATE kudos SET title = ? WHERE id = ?")
      .run(EXISTING_TITLES[i], existing[i].id);
  }
  console.log(`✓ Updated ${Math.min(existing.length, EXISTING_TITLES.length)} existing kudos with titles`);

  // 2. Insert new departments (skip existing)
  for (const dept of NEW_DEPARTMENTS) {
    try {
      db.$client.prepare("INSERT OR IGNORE INTO departments (id, name) VALUES (?, ?)").run(dept.id, dept.name);
    } catch { /* ignore */ }
  }
  console.log(`✓ Inserted new departments`);

  // 3. Insert new users + profiles
  for (const u of NEW_USERS) {
    try {
      db.$client.prepare("INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)").run(u.id, u.name, u.email);
      db.$client.prepare(
        "INSERT OR IGNORE INTO profiles (id, display_name, avatar_url, department_id, role) VALUES (?, ?, NULL, ?, ?)"
      ).run(u.id, u.name, u.dept, u.role);
    } catch { /* ignore */ }
  }
  console.log(`✓ Inserted ${NEW_USERS.length} new users`);

  // 4. Insert 60 new kudos
  const now = Date.now();
  const kudoIds: string[] = [];
  for (let i = 0; i < NEW_KUDOS.length; i++) {
    const k = NEW_KUDOS[i];
    const id = crypto.randomUUID();
    kudoIds.push(id);
    const createdAt = new Date(now - (i + 30) * 2 * 3600000).toISOString();
    db.$client.prepare(
      "INSERT OR IGNORE INTO kudos (id, sender_id, receiver_id, title, content, is_anonymous, anonymous_name, created_at) VALUES (?, ?, ?, ?, ?, 0, NULL, ?)"
    ).run(id, k.s, k.r, k.title, k.content, createdAt);

    for (const tagId of k.tags) {
      db.$client.prepare("INSERT OR IGNORE INTO kudo_hashtags (kudo_id, hashtag_id) VALUES (?, ?)").run(id, tagId);
    }
  }
  console.log(`✓ Inserted ${NEW_KUDOS.length} new kudos`);

  // 5. Insert hearts with varied counts
  for (let i = 0; i < kudoIds.length; i++) {
    const likers = heartLikers(i, HEART_COUNTS[i] ?? 0);
    for (const userId of likers) {
      db.$client.prepare("INSERT OR IGNORE INTO kudo_hearts (kudo_id, user_id) VALUES (?, ?)").run(kudoIds[i], userId);
    }
  }
  console.log(`✓ Inserted hearts with varied counts`);

  // 6. Update profile counters
  db.$client.exec(`
    UPDATE profiles SET
      kudos_sent_count     = (SELECT COUNT(*) FROM kudos WHERE sender_id = profiles.id),
      kudos_received_count = (SELECT COUNT(*) FROM kudos WHERE receiver_id = profiles.id),
      hearts_received_count = (SELECT COUNT(*) FROM kudo_hearts kh JOIN kudos k ON k.id = kh.kudo_id WHERE k.receiver_id = profiles.id)
  `);

  // 7. Recompute title cache
  db.$client.exec(`CREATE TABLE IF NOT EXISTS user_title_cache (
    user_id TEXT PRIMARY KEY,
    title TEXT,
    unique_senders_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  type Row = { receiver_id: string; unique_senders: number };
  const rows = db.$client.prepare(
    "SELECT receiver_id, COUNT(DISTINCT sender_id) AS unique_senders FROM kudos GROUP BY receiver_id"
  ).all() as Row[];

  for (const row of rows) {
    const title = computeTitle(row.unique_senders);
    db.$client.prepare(`
      INSERT INTO user_title_cache (user_id, title, unique_senders_count, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        title = excluded.title,
        unique_senders_count = excluded.unique_senders_count,
        updated_at = CURRENT_TIMESTAMP
    `).run(row.receiver_id, title, row.unique_senders);
  }

  console.log(`✓ Title cache recomputed for ${rows.length} users`);
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
