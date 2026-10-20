import { useEffect, useState, type FormEvent } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import {
  AuthError,
  MissingIdentityError,
  acceptInvite,
  handleAuthCallback,
  login,
  logout,
  requestPasswordRecovery,
  updateUser,
} from "@netlify/identity"

import { getCurrentPublisher, publishArticle } from "@/lib/articles.functions"
import { CATEGORIES } from "@/lib/categories"

export const Route = createFileRoute("/publier")({
  loader: () => getCurrentPublisher(),
  component: Publier,
})

const inputClass =
  "w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black"
const buttonClass =
  "w-full bg-black text-white py-4 uppercase tracking-wide text-sm hover:bg-black/85 disabled:opacity-50 transition-colors"

type Callback = { type: "invite"; token: string } | { type: "recovery" } | null

function authErrorMessage(err: unknown) {
  if (err instanceof MissingIdentityError) {
    return "La connexion n'est pas disponible pour le moment."
  }
  if (err instanceof AuthError) {
    if (err.status === 401) return "Email ou mot de passe incorrect."
    if (err.status === 422) return "Informations invalides (mot de passe trop court ?)."
    return err.message
  }
  return "Une erreur est survenue."
}

function Publier() {
  const publisher = Route.useLoaderData()
  const [callback, setCallback] = useState<Callback>(null)

  useEffect(() => {
    handleAuthCallback()
      .then((result) => {
        if (!result) return
        if (result.type === "invite" && result.token) {
          setCallback({ type: "invite", token: result.token })
        } else if (result.type === "recovery") {
          setCallback({ type: "recovery" })
        } else {
          window.location.reload()
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-2">
        Espace de publication
      </h1>
      {callback ? (
        <SetPassword callback={callback} />
      ) : !publisher ? (
        <LoginForm />
      ) : !publisher.isOwner ? (
        <NotOwner email={publisher.email} />
      ) : (
        <>
          <OwnerBar email={publisher.email} />
          <PublishForm />
        </>
      )}
    </div>
  )
}

async function handleLogout() {
  try {
    await logout()
  } finally {
    window.location.href = "/"
  }
}

function OwnerBar({ email }: { email: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-black/15 px-4 py-3 mb-10 text-sm">
      <span className="text-black/60">
        Connecté en tant que propriétaire : <strong className="text-black">{email}</strong>
      </span>
      <button type="button" onClick={handleLogout} className="underline hover:no-underline">
        Se déconnecter
      </button>
    </div>
  )
}

function NotOwner({ email }: { email: string }) {
  return (
    <div className="mt-6 space-y-6">
      <p className="border border-black px-4 py-3 bg-neutral-50">
        Le compte <strong>{email}</strong> n'est pas autorisé à publier. Seul le
        propriétaire du site peut publier des articles.
      </p>
      <button type="button" onClick={handleLogout} className={buttonClass}>
        Se déconnecter
      </button>
    </div>
  )
}

function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    try {
      await login(email, (formData.get("password") as string) || "")
      window.location.reload()
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgot() {
    setError(null)
    setInfo(null)
    if (!email) {
      setError("Saisissez votre email pour recevoir un lien de réinitialisation.")
      return
    }
    try {
      await requestPasswordRecovery(email)
      setInfo("Un email de réinitialisation vous a été envoyé.")
    } catch (err) {
      setError(authErrorMessage(err))
    }
  }

  return (
    <>
      <p className="text-black/60 mb-10">
        La publication est réservée au propriétaire du site. Connectez-vous pour
        continuer.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-sm border border-black px-4 py-3 bg-neutral-50">{error}</p>
        )}
        {info && <p className="text-sm border border-black/20 px-4 py-3">{info}</p>}
        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? "Connexion..." : "Se connecter"}
        </button>
        <button
          type="button"
          onClick={handleForgot}
          className="text-sm underline hover:no-underline"
        >
          Mot de passe oublié ?
        </button>
      </form>
    </>
  )
}

function SetPassword({ callback }: { callback: NonNullable<Callback> }) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const password = (new FormData(event.currentTarget).get("password") as string) || ""
    try {
      if (callback.type === "invite") {
        await acceptInvite(callback.token, password)
      } else {
        await updateUser({ password })
      }
      window.location.href = "/publier"
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <p className="text-black/60 mb-10">
        {callback.type === "invite"
          ? "Bienvenue ! Choisissez un mot de passe pour activer votre compte."
          : "Choisissez un nouveau mot de passe."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="new-password">
            Mot de passe
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-sm border border-black px-4 py-3 bg-neutral-50">{error}</p>
        )}
        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting ? "Enregistrement..." : "Enregistrer le mot de passe"}
        </button>
      </form>
    </>
  )
}

function PublishForm() {
  const navigate = useNavigate()
  const publish = useServerFn(publishArticle)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    try {
      const result = await publish({ data: formData })
      if (!result.success) {
        setError(result.error)
        return
      }
      navigate({ to: "/articles/$slug", params: { slug: result.article.slug } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <p className="text-black/60 mb-10">
        Publiez un nouvel article LEGEND avec sa photo. Sans photo, l'image du
        micro LEGEND est utilisée par défaut.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="title">
            Titre *
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="category">
            Rubrique *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black bg-white"
          >
            <option value="" disabled>
              Choisir une rubrique
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="excerpt">
            Résumé *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            className="w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="content">
            Contenu de l'article *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={10}
            className="w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="author">
            Auteur
          </label>
          <input
            id="author"
            name="author"
            placeholder="Rédaction LEGEND"
            className="w-full border border-black/25 px-4 py-3 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="image">
            Photo de l'article
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full border border-black/25 px-4 py-3"
          />
        </div>

        {error && (
          <p className="text-sm border border-black px-4 py-3 bg-neutral-50">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-4 uppercase tracking-wide text-sm hover:bg-black/85 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Publication en cours..." : "Publier l'article"}
        </button>
      </form>
    </>
  )
}
