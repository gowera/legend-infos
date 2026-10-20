import { useEffect } from "react"

import ArticlePage from "@/routes/articles.$slug"
import AboutPage from "@/routes/a-propos"
import CategoryPage from "@/routes/categorie.$category"
import HomePage from "@/routes/index"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Link, usePathname } from "@/lib/router"

function MissingPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold mb-4">Page introuvable</h1>
      <p className="text-black/60 mb-6">La page demandée n'existe pas.</p>
      <Link to="/" className="underline underline-offset-4">
        Retour à l'accueil
      </Link>
    </section>
  )
}

function PublishingNotice() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="font-display text-3xl font-bold mb-4">
        Publication des articles
      </h1>
      <p className="text-black/70 leading-relaxed">
        La publication et la gestion des articles se font dans l'administration
        WordPress. Ce site est une interface de consultation en lecture seule.
      </p>
    </section>
  )
}

export default function App() {
  const pathname = usePathname()

  useEffect(() => {
    const title = pathname.startsWith("/articles/")
      ? "Article — LEGEND"
      : pathname.startsWith("/categorie/")
        ? "Rubrique — LEGEND"
        : pathname === "/a-propos"
          ? "À propos — LEGEND"
          : pathname === "/publier"
            ? "Publication — LEGEND"
            : pathname === "/"
              ? "LEGEND — L'information au cœur de l'action citoyenne"
              : "Page introuvable — LEGEND"
    document.title = title
  }, [pathname])

  const articleMatch = pathname.match(/^\/articles\/([^/]+)\/?$/)
  const categoryMatch = pathname.match(/^\/categorie\/([^/]+)\/?$/)
  let articleSlug: string | null = null
  let categorySlug: string | null = null
  try {
    articleSlug = articleMatch ? decodeURIComponent(articleMatch[1]) : null
    categorySlug = categoryMatch ? decodeURIComponent(categoryMatch[1]) : null
  } catch {
    articleSlug = null
    categorySlug = null
  }

  let page
  if (pathname === "/" || pathname === "") {
    page = <HomePage />
  } else if (pathname === "/a-propos") {
    page = <AboutPage />
  } else if (pathname === "/publier") {
    page = <PublishingNotice />
  } else if (categorySlug !== null) {
    page = <CategoryPage slug={categorySlug} />
  } else if (articleSlug !== null) {
    page = <ArticlePage slug={articleSlug} />
  } else {
    page = <MissingPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  )
}
