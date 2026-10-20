import { desc, eq } from "drizzle-orm"
import { getStore } from "@netlify/blobs"

import { db } from "../../db/index.js"
import { articles } from "../../db/schema.js"
import { slugify } from "./categories"

function imageStore() {
  return getStore("article-images")
}

export async function listArticlesFromDb(category?: string) {
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt))
  return category ? rows.filter((row) => row.category === category) : rows
}

export async function findArticleBySlugFromDb(slug: string) {
  const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  return row ?? null
}

export async function saveArticleImage(file: File): Promise<string> {
  const key = crypto.randomUUID()
  const buffer = await file.arrayBuffer()
  await imageStore().set(key, buffer, {
    metadata: { contentType: file.type || "image/jpeg" },
  })
  return key
}

export async function readArticleImage(key: string) {
  return imageStore().getWithMetadata(key, { type: "arrayBuffer" })
}

export async function insertArticle(input: {
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageKey: string | null
}) {
  const baseSlug = slugify(input.title) || `article-${Date.now()}`
  let slug = baseSlug
  if (await findArticleBySlugFromDb(slug)) {
    slug = `${baseSlug}-${Date.now().toString(36)}`
  }

  const [row] = await db
    .insert(articles)
    .values({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      author: input.author || "Rédaction LEGEND",
      imageKey: input.imageKey,
    })
    .returning()

  return row
}
