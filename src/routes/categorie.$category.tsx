import { CATEGORIES, isValidCategory, getCategoryLabel } from "@/lib/categories"
import { useArticles } from "@/lib/useArticles"
import ArticleCard from "@/components/ArticleCard"

export default function CategoryPage({ slug: category }: { slug: string }) {
  const { articles, loading, error } = useArticles(category)
  const info = CATEGORIES.find((c) => c.slug === category)

  if (!isValidCategory(category)) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Rubrique introuvable</h1>
      </section>
    )
  }

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

      {loading ? (
        <p role="status" className="text-black/60">Chargement des articles…</p>
      ) : error ? (
        <p role="alert" className="border border-red-300 bg-red-50 p-5 text-red-900">
          Impossible de charger les articles : {error}
        </p>
      ) : articles.length === 0 ? (
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
