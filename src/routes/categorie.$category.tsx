import { createFileRoute, notFound } from "@tanstack/react-router"

import { listArticles } from "@/lib/articles.functions"
import { CATEGORIES, isValidCategory, getCategoryLabel } from "@/lib/categories"
import ArticleCard from "@/components/ArticleCard"

export const Route = createFileRoute("/categorie/$category")({
  loader: async ({ params }) => {
    if (!isValidCategory(params.category)) {
      throw notFound()
    }
    const articles = await listArticles({ data: { category: params.category } })
    return { category: params.category, articles }
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category, articles } = Route.useLoaderData()
  const info = CATEGORIES.find((c) => c.slug === category)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-12 border-b border-black/10 pb-8">
        <h1 className="font-display text-4xl font-bold">
          {getCategoryLabel(category)}
        </h1>
        {info && (
          <p className="text-black/60 mt-3 max-w-2xl">{info.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="text-black/60">
          Aucun article n'a encore été publié dans cette rubrique.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
