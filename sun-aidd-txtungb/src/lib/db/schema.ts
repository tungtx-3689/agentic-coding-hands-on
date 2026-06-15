import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── NextAuth required tables ────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ─── App tables ──────────────────────────────────────────────────────────────

export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  departmentId: text("department_id").references(() => departments.id),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  kudosReceivedCount: integer("kudos_received_count").default(0).notNull(),
  kudosSentCount: integer("kudos_sent_count").default(0).notNull(),
  heartsReceivedCount: integer("hearts_received_count").default(0).notNull(),
});

export const hashtags = sqliteTable("hashtags", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const kudos = sqliteTable("kudos", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => profiles.id),
  receiverId: text("receiver_id").notNull().references(() => profiles.id),
  content: text("content").notNull(),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }).default(false).notNull(),
  anonymousName: text("anonymous_name"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const kudoHashtags = sqliteTable(
  "kudo_hashtags",
  {
    kudoId: text("kudo_id").notNull().references(() => kudos.id, { onDelete: "cascade" }),
    hashtagId: text("hashtag_id").notNull().references(() => hashtags.id),
  },
  (t) => [primaryKey({ columns: [t.kudoId, t.hashtagId] })]
);

export const kudoImages = sqliteTable("kudo_images", {
  id: text("id").primaryKey(),
  kudoId: text("kudo_id").notNull().references(() => kudos.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const kudoHearts = sqliteTable(
  "kudo_hearts",
  {
    kudoId: text("kudo_id").notNull().references(() => kudos.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => profiles.id),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (t) => [primaryKey({ columns: [t.kudoId, t.userId] })]
);

export const secretBoxes = sqliteTable("secret_boxes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => profiles.id),
  isOpened: integer("is_opened", { mode: "boolean" }).default(false).notNull(),
  openedAt: text("opened_at"),
  rewardDescription: text("reward_description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const awards = sqliteTable("awards", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  count: integer("count").notNull(),
  value: text("value").notNull(),
  imageUrl: text("image_url"),
});
