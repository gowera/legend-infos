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

export default function About() {
  return (
    <div>
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            À propos de LEGEND
          </h1>
          <p className="font-display text-xl italic text-white/80 mt-4">
            L'information au cœur de l'action citoyenne.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold mb-4">Qui sommes-nous</h2>
        <p className="text-black/75 leading-relaxed mb-4">
          LEGEND est un média d'information en ligne dédié à l'actualité, à
          l'investigation, au débat public et à la promotion de l'action
          citoyenne.
        </p>
        <p className="text-black/75 leading-relaxed">
          Notre mission est de produire et de diffuser une information
          rigoureuse, vérifiée et accessible, en accordant une attention
          particulière aux réalités vécues par les populations et aux enjeux
          qui touchent directement la société.
        </p>
      </section>

      <section className="bg-neutral-50 border-y border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-center mb-10">
            Notre ligne éditoriale
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {CATEGORIES.filter((c) => c.slug !== "actualite").map((cat) => (
              <div key={cat.slug} className="border border-black/15 p-8 bg-white">
                <h3 className="font-display text-xl font-bold mb-3">
                  {cat.label}
                </h3>
                <p className="text-sm text-black/60 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">
          Nos valeurs
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {VALUES.map((value) => (
            <span
              key={value}
              className="border border-black px-4 py-2 text-sm uppercase tracking-wide"
            >
              {value}
            </span>
          ))}
        </div>
        <p className="text-black/75 leading-relaxed mt-10 text-center max-w-2xl mx-auto">
          LEGEND entend être un espace où l'information contribue au débat
          public, où les citoyens peuvent faire entendre leur voix et où les
          faits sont placés au cœur du travail journalistique.
        </p>
      </section>

      <section className="bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold mb-4">
            Notre engagement
          </h2>
          <p className="text-white/80 leading-relaxed">
            Informer avec rigueur, enquêter avec responsabilité et donner une
            voix aux citoyens.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Nous contacter</h2>
        <p className="text-black/75 leading-relaxed mb-6">
          Une information, un témoignage ou une question ? Joignez la rédaction.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={CONTACT_PHONE_HREF}
            className="border border-black px-5 py-2 text-sm uppercase tracking-wide hover:bg-black hover:text-white"
          >
            Appeler le {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-5 py-2 text-sm uppercase tracking-wide hover:bg-black/80"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
