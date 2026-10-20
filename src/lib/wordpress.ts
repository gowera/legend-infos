import { CATEGORIES } from "@/lib/categories"

const POSTS_PER_PAGE = 100
const ALLOWED_CONTENT_TAGS = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "CODE",
  "EM",
  "FIGCAPTION",
  "FIGURE",
  "H2",
  "H3",
  "H4",
  "HR",
  "I",
  "IMG",
  "LI",
  "OL",
  "P",
  "PRE",
  "STRONG",
  "UL",
])
const CONTENT_ATTRIBUTES: Record<string, string[]> = {
  A: ["href", "title"],
  IMG: ["src", "alt", "width", "height"],
}

export type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  createdAt: string
  imageUrl: string | null
}

type RenderedText = { rendered: string }
type WordPressTerm = { slug: string; name: string; taxonomy?: string }
type WordPressPost = {
  id: number
  slug: string
  date: string
  title: RenderedText
  excerpt: RenderedText
  content: RenderedText
  categories: number[]
  _embedded?: Record<string, unknown>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isRenderedText(value: unknown): value is RenderedText {
  return isRecord(value) && typeof value.rendered === "string"
}

function isWordPressPost(value: unknown): value is WordPressPost {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.slug === "string" &&
    typeof value.date === "string" &&
    isRenderedText(value.title) &&
    isRenderedText(value.excerpt) &&
    isRenderedText(value.content) &&
    Array.isArray(value.categories) &&
    value.categories.every((category) => typeof category === "number") &&
    (value._embedded === undefined || isRecord(value._embedded))
  )
}

function getPostsUrl() {
  const siteUrl = import.meta.env.VITE_WORDPRESS_URL?.trim().replace(/\/+$/, "")
  if (!siteUrl) {
    throw new Error(
      "L'adresse WordPress n'est pas configurée. Définissez VITE_WORDPRESS_URL dans .env.local.",
    )
  }

  const baseUrl = siteUrl.replace(/\/wp-json$/, "")
  const url = new URL(baseUrl)
  url.searchParams.set("rest_route", "/wp/v2/posts")
  return url
}

async function fetchPostsPage(page: number, signal?: AbortSignal) {
  const url = getPostsUrl()
  url.searchParams.set("per_page", String(POSTS_PER_PAGE))
  url.searchParams.set("page", String(page))
  url.searchParams.set("_embed", "1")
  url.searchParams.set("orderby", "date")
  url.searchParams.set("order", "desc")

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  })
  if (!response.ok) {
    throw new Error(
      `WordPress a refusé la requête des articles (HTTP ${response.status}). Vérifiez l'adresse de l'API et ses autorisations CORS.`,
    )
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload) || !payload.every(isWordPressPost)) {
    throw new Error("La réponse de l'API WordPress n'a pas le format attendu.")
  }
  return payload
}

function readEmbeddedList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function readWordPressTerms(post: WordPressPost): WordPressTerm[] {
  const groups = post._embedded?.["wp:term"]
  if (!Array.isArray(groups)) return []

  return groups
    .flatMap((group) => (Array.isArray(group) ? group : []))
    .filter(
      (term): term is Record<string, unknown> =>
        isRecord(term) &&
        typeof term.slug === "string" &&
        typeof term.name === "string",
    )
    .map((term) => ({
      slug: term.slug as string,
      name: term.name as string,
      taxonomy: typeof term.taxonomy === "string" ? term.taxonomy : undefined,
    }))
}

function readEmbeddedText(post: WordPressPost, key: string, field: string) {
  const items = readEmbeddedList(post._embedded?.[key])
  const value = items[0]?.[field]
  return typeof value === "string" ? value : null
}

function safeMediaUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value, window.location.origin)
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}

function stripHtml(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html")
  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim()
}

function isSafeLink(value: string) {
  if (value.startsWith("#")) return true
  try {
    const url = new URL(value, window.location.origin)
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
  } catch {
    return false
  }
}

function sanitizeWordPressContent(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html")
  for (const element of Array.from(document.body.querySelectorAll("*"))) {
    if (!ALLOWED_CONTENT_TAGS.has(element.tagName)) {
      if (["SCRIPT", "STYLE", "SVG", "IFRAME", "OBJECT", "FORM"].includes(element.tagName)) {
        element.remove()
      } else {
        element.replaceWith(...Array.from(element.childNodes))
      }
      continue
    }

    const allowedAttributes = CONTENT_ATTRIBUTES[element.tagName] ?? []
    for (const attribute of Array.from(element.attributes)) {
      if (!allowedAttributes.includes(attribute.name)) {
        element.removeAttribute(attribute.name)
      }
    }

    if (element instanceof HTMLAnchorElement) {
      const href = element.getAttribute("href")
      if (href && !isSafeLink(href)) element.removeAttribute("href")
    }
    if (element instanceof HTMLImageElement) {
      const src = element.getAttribute("src")
      if (src && !safeMediaUrl(src)) element.remove()
    }
  }
  return document.body.innerHTML
}

function toArticle(post: WordPressPost): Article {
  const category = readWordPressTerms(post).find(
    (term) =>
      term.taxonomy === "category" &&
      CATEGORIES.some((known) => known.slug === term.slug),
  )
  const media = readEmbeddedText(post, "wp:featuredmedia", "source_url")
  const author = stripHtml(readEmbeddedText(post, "wp:author", "name") ?? "")

  return {
    id: post.id,
    title: stripHtml(post.title.rendered),
    slug: post.slug,
    excerpt: stripHtml(post.excerpt.rendered),
    content: sanitizeWordPressContent(post.content.rendered),
    category: category?.slug ?? "actualite",
    author: author || "Rédaction LEGEND",
    createdAt: post.date,
    imageUrl: safeMediaUrl(media),
  }
}

export async function listArticles(category?: string, signal?: AbortSignal) {
  const posts: WordPressPost[] = []
  for (let page = 1; ; page += 1) {
    const currentPage = await fetchPostsPage(page, signal)
    posts.push(...currentPage)
    if (currentPage.length < POSTS_PER_PAGE) break
  }

  const articles = posts.map(toArticle)
  return category
    ? articles.filter((article) => article.category === category)
    : articles
}

export async function getArticleBySlug(slug: string, signal?: AbortSignal) {
  const url = getPostsUrl()
  url.searchParams.set("slug", slug)
  url.searchParams.set("_embed", "1")

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  })
  if (!response.ok) {
    throw new Error(`WordPress a refusé la requête de l'article (HTTP ${response.status}).`)
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload) || !payload.every(isWordPressPost)) {
    throw new Error("La réponse de l'API WordPress n'a pas le format attendu.")
  }

  const post = payload[0]
  return post ? toArticle(post) : null
}
