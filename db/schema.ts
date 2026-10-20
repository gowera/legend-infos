import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial().primaryKey(),
  title: text().notNull(),
  slug: text().notNull().unique(),
  excerpt: text().notNull(),
  content: text().notNull(),
  category: text().notNull(),
  imageKey: text("image_key"),
  author: text().notNull().default("Rédaction LEGEND"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
