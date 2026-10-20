import { createServerFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"
import { getUser } from "@netlify/identity"

import {
  findArticleBySlugFromDb,
  insertArticle,
  listArticlesFromDb,
  saveArticleImage,
} from "./articles.server"
import { isValidCategory } from "./categories"
import { hasOwnerRole } from "./owner"

export const getCurrentPublisher = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getUser()
  if (!user) return null
  return { email: user.email ?? "", isOwner: hasOwnerRole(user) }
})

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: string } | undefined) => data ?? {})
  .handler(async ({ data }) => {
    return listArticlesFromDb(data.category)
  })

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return findArticleBySlugFromDb(data.slug)
  })

// Origine publique du site (ex. https://legend-infos.netlify.app), nécessaire pour
// les URL absolues des balises Open Graph lues par Facebook, WhatsApp, etc.
export const getSiteOrigin = createServerFn({ method: "GET" }).handler(async () => {
  return getRequestUrl().origin
})

export const publishArticle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Formulaire invalide")
    }
    return data
  })
  .handler(async ({ data }) => {
    const user = await getUser()
    if (!hasOwnerRole(user)) {
      return {
        success: false as const,
        error: "Seul le propriétaire du site est autorisé à publier.",
      }
    }

    const title = ((data.get("title") as string) || "").trim()
    const excerpt = ((data.get("excerpt") as string) || "").trim()
    const content = ((data.get("content") as string) || "").trim()
    const category = ((data.get("category") as string) || "").trim()
    const author = ((data.get("author") as string) || "").trim()
    const image = data.get("image")

    if (!title || !excerpt || !content || !isValidCategory(category)) {
      return { success: false as const, error: "Merci de remplir tous les champs obligatoires." }
    }

    let imageKey: string | null = null
    if (image instanceof File && image.size > 0) {
      imageKey = await saveArticleImage(image)
    }

    const article = await insertArticle({
      title,
      excerpt,
      content,
      category,
      author,
      imageKey,
    })

    return { success: true as const, article }
  })
