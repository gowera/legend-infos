import { useEffect } from "react"

import ShareButtons from "@/components/ShareButtons"
import FallbackImage from "@/components/FallbackImage"
import { getCategoryLabel } from "@/lib/categories"
import { microImageUrl } from "@/lib/media"
import { useArticle } from "@/lib/useArticles"

export default function ArticlePage({ slug }: { slug: string }) {
  const { article, loading, error } = useArticle(slug)

  useEffect(() => {
    if (!article) return
    document.title = `${article.title} — LEGEND`
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = article.excerpt
  }, [article])

  if (loading) {
    return <p role="status" className="max-w-3xl mx-auto px-4 py-16">Chargement de l'article…</p>
  }
  if (error) {
    return (
      <p role="alert" className="max-w-3xl mx-auto px-4 py-16 text-red-900">
        Impossible de charger l'article : {error}
      </p>
    )
  }
  if (!article) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Article introuvable</h1>
      </section>
    )
  }

  const imageSrc = article.imageUrl ?? microImageUrl()

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

      <FallbackImage
        src={imageSrc}
        alt={article.title}
        fallbackSrc={microImageUrl()}
        className="w-full aspect-[16/9] object-cover mt-8 border border-black/10"
      />

      <p className="font-display text-xl italic text-black/70 mt-8">
        {article.excerpt}
      </p>

      <div className="article-content mt-8 text-black/85" dangerouslySetInnerHTML={{ __html: article.content }} />

      <ShareButtons title={article.title} path={`/articles/${article.slug}`} />
    </article>
  )
}
