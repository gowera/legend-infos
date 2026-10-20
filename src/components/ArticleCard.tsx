import { Link } from "@tanstack/react-router"

import { getCategoryLabel } from "@/lib/categories"
import { microImageUrl } from "@/lib/media"
import type { Article } from "@/lib/types"

function imageUrl(imageKey: string | null, width: number) {
  if (!imageKey) return microImageUrl(width)
  return `/.netlify/images?url=/api/images/${imageKey}&w=${width}&fit=cover&fm=webp`
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function ArticleCard({
  article,
  featured = false,
}: {
  article: Article
  featured?: boolean
}) {
  const src = imageUrl(article.imageKey, featured ? 900 : 500)

  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="group block"
    >
      <article className="flex flex-col h-full">
        <div
          className={`w-full bg-neutral-100 border border-black/10 overflow-hidden ${
            featured ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <img
            src={src}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="pt-4">
          <span className="text-xs uppercase tracking-widest text-black/60">
            {getCategoryLabel(article.category)}
          </span>
          <h3
            className={`font-display font-bold mt-1 group-hover:underline ${
              featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
          <p className="text-sm text-black/60 mt-2 line-clamp-2">
            {article.excerpt}
          </p>
          <p className="text-xs text-black/40 mt-3">
            {article.author} · {formatDate(article.createdAt)}
          </p>
        </div>
      </article>
    </Link>
  )
}
