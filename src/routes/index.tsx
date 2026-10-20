import { CATEGORIES } from "@/lib/categories"
import { Link } from "@/lib/router"
import { useArticles } from "@/lib/useArticles"
import ArticleCard from "@/components/ArticleCard"
import FallbackImage from "@/components/FallbackImage"
import { microImageUrl } from "@/lib/media"

export default function Home() {
  const { articles, loading, error } = useArticles()
  const [featured, ...rest] = articles

  return (
    <div>
      <section className="relative bg-black text-white overflow-hidden">
        <FallbackImage
          src={microImageUrl()}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_70%] grayscale opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="relative max-w-6xl mx-auto px-4 py-28 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-white/60 mb-6">
            Média d'information en ligne
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            LEGEND
          </h1>
          <p className="font-display text-lg md:text-2xl mt-4 italic text-white/90">
            L'information au cœur de l'action citoyenne.
          </p>
          <p className="max-w-2xl mx-auto text-white/70 mt-6 leading-relaxed">
            Une information rigoureuse, vérifiée et accessible, au service des
            réalités vécues par les populations et des enjeux qui touchent
            directement la société.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          <p role="status" className="py-16 text-center text-black/60">
            Chargement des articles…
          </p>
        ) : error ? (
          <p role="alert" className="border border-red-300 bg-red-50 p-5 text-red-900">
            Impossible de charger les articles : {error}
          </p>
        ) : articles.length === 0 ? (
          <div className="border border-black/10 py-20 text-center">
            <p className="font-display text-2xl mb-2">Aucun article publié pour le moment</p>
            <p className="text-black/60">
              La rédaction s'apprête à publier ses premiers articles.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <ArticleCard article={featured} featured />
            </div>
            <div className="space-y-8">
              {rest.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {rest.length > 2 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mt-16">
            {rest.slice(2).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-neutral-50 border-y border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl font-bold text-center mb-2">
            Notre ligne éditoriale
          </h2>
          <p className="text-center text-black/60 max-w-2xl mx-auto mb-12">
            LEGEND s'articule autour de trois grands axes.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {CATEGORIES.filter((c) => c.slug !== "actualite").map((cat) => (
              <Link
                key={cat.slug}
                to={`/categorie/${cat.slug}`}
                className="block border border-black/15 p-8 hover:border-black transition-colors"
              >
                <h3 className="font-display text-xl font-bold mb-3">{cat.label}</h3>
                <p className="text-sm text-black/60 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Notre engagement</h2>
        <p className="text-black/70 leading-relaxed">
          Informer avec rigueur, enquêter avec responsabilité et donner une voix
          aux citoyens.
        </p>
      </section>
    </div>
  )
}
