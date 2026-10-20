import { useEffect, useState } from "react"

import { getArticleBySlug, listArticles, type Article } from "@/lib/wordpress"

type ArticlesState = {
  articles: Article[]
  loading: boolean
  error: string | null
}

type ArticleState = {
  article: Article | null
  loading: boolean
  error: string | null
}

function errorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return "Impossible de joindre WordPress. Vérifiez votre connexion et, si le site est sur un autre domaine, autorisez son origine dans les réglages CORS de WordPress."
  }
  return error instanceof Error ? error.message : "Une erreur inconnue est survenue."
}

export function useArticles(category?: string): ArticlesState {
  const [state, setState] = useState<ArticlesState>({
    articles: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ articles: [], loading: true, error: null })
    listArticles(category, controller.signal)
      .then((articles) => setState({ articles, loading: false, error: null }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ articles: [], loading: false, error: errorMessage(error) })
        }
      })
    return () => controller.abort()
  }, [category])

  return state
}

export function useArticle(slug: string): ArticleState {
  const [state, setState] = useState<ArticleState>({
    article: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ article: null, loading: true, error: null })
    getArticleBySlug(slug, controller.signal)
      .then((article) => setState({ article, loading: false, error: null }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ article: null, loading: false, error: errorMessage(error) })
        }
      })
    return () => controller.abort()
  }, [slug])

  return state
}
