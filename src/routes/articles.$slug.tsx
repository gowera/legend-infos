import { createFileRoute, notFound } from "@tanstack/react-router"

import ShareButtons from "@/components/ShareButtons"
import { getArticleBySlug, getSiteOrigin } from "@/lib/articles.functions"
import { getCategoryLabel } from "@/lib/categories"
import { MICRO_IMAGE, microImageUrl } from "@/lib/media"

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ params }) => {
    const [article, origin] = await Promise.all([
      getArticleBySlug({ data: { slug: params.slug } }),
      getSiteOrigin(),
    ])
    if (!article) {
      throw notFound()
    }
    return { article, origin }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { article, origin } = loaderData
    // Photo de l'article (ou photo de micro par défaut) mise en avant lors du partage.
    // JPEG 1200×630 : format recommandé par Facebook/WhatsApp pour les aperçus.
    const imagePath = article.imageKey ? `/api/images/${article.imageKey}` : MICRO_IMAGE
    const shareImage = `${origin}/.netlify/images?url=${imagePath}&w=1200&h=630&fit=cover&fm=jpg`
    const url = `${origin}/articles/${article.slug}`
    const title = `${article.title} — LEGEND`
    return {
      meta: [
        { title },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "LEGEND" },
        { property: "og:image", content: shareImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: article.title },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: article.title },
        { name: "twitter:description", content: article.excerpt },
        { name: "twitter:image", content: shareImage },
      ],
      links: [{ rel: "canonical", href: url }],
    }
  },
  component: ArticlePage,
})

function ArticlePage() {
  const { article } = Route.useLoaderData()
  const imageSrc = article.imageKey
    ? `/.netlify/images?url=/api/images/${article.imageKey}&w=1200&fm=webp`
    : microImageUrl(1200)

  const paragraphs = article.content.split(/\n+/).filter((p) => p.trim().length > 0)

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-xs uppercase tracking-widest text-black/60 mb-3">
        {getCategoryLabel(article.category)}
      </p>
      <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
        {article.title}
      </h1>
      <p className="text-sm text-black/50 mt-4">
        Par {article.author} ·{" "}
        {new Date(article.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <img
        src={imageSrc}
        alt={article.title}
        className="w-full aspect-[16/9] object-cover mt-8 border border-black/10"
      />

      <p className="font-display text-xl italic text-black/70 mt-8">
        {article.excerpt}
      </p>

      <div className="article-content mt-8 text-black/85">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <ShareButtons title={article.title} path={`/articles/${article.slug}`} />
    </article>
  )
}
