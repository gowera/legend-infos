import { Link } from "@tanstack/react-router"

import { CATEGORIES } from "@/lib/categories"
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  CONTACT_WHATSAPP_HREF,
} from "@/lib/contact"

const VALUES = [
  "Vérité",
  "Indépendance",
  "Intégrité",
  "Responsabilité",
  "Professionnalisme",
  "Engagement citoyen",
]

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/.netlify/images?url=/legend-logo.jpeg&w=64&h=64&fit=cover&fm=webp"
              alt="Logo LEGEND"
              className="h-9 w-9 rounded-full bg-white object-contain p-1"
            />
            <span className="font-display text-xl font-bold">LEGEND</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Média d'information en ligne dédié à l'actualité, à l'investigation, au
            débat public et à la promotion de l'action citoyenne.
          </p>
        </div>

        <div>
          <h3 className="uppercase text-xs tracking-widest text-white/50 mb-4">
            Rubriques
          </h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to="/categorie/$category"
                  params={{ category: cat.slug }}
                  className="text-white/80 hover:text-white"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/a-propos" className="text-white/80 hover:text-white">
                À propos de LEGEND
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="uppercase text-xs tracking-widest text-white/50 mb-4">
            Nos valeurs
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            {VALUES.join(" · ")}
          </p>

          <h3 className="uppercase text-xs tracking-widest text-white/50 mt-8 mb-4">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={CONTACT_PHONE_HREF}
                className="text-white/80 hover:text-white"
              >
                Tél. : {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>LEGEND — L'information au cœur de l'action citoyenne.</p>
          <p>© {new Date().getFullYear()} LEGEND. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
