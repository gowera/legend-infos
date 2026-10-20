import { useState } from "react"
import { Menu, X } from "lucide-react"

import { CATEGORIES } from "@/lib/categories"
import { Link } from "@/lib/router"

const LOGO_IMAGE = `${import.meta.env.BASE_URL}legend-logo.jpeg`

export default function Header() {
  const [open, setOpen] = useState(false)

  const navLinkClass =
    "text-sm uppercase tracking-wide text-white/80 hover:text-white transition-colors"

  return (
    <header className="bg-black text-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO_IMAGE} alt="Logo LEGEND" className="h-11 w-11 rounded-full bg-white object-contain p-1" />
            <span className="font-display text-2xl font-bold tracking-tight">
              LEGEND
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className={navLinkClass}>
              Accueil
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categorie/${cat.slug}`}
                className={navLinkClass}
              >
                {cat.label}
              </Link>
            ))}
            <Link to="/a-propos" className={navLinkClass}>
              À propos
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/20 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setOpen(false)} className={navLinkClass}>
            Accueil
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categorie/${cat.slug}`}
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              {cat.label}
            </Link>
          ))}
          <Link to="/a-propos" onClick={() => setOpen(false)} className={navLinkClass}>
            À propos
          </Link>
        </nav>
      )}
    </header>
  )
}
