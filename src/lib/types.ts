import type { articles } from "../../db/schema"

export type Article = typeof articles.$inferSelect
