export type CategorySlug =
  | "actualite"
  | "investigations"
  | "debats-emissions"
  | "action-citoyenne"

export interface CategoryInfo {
  slug: CategorySlug
  label: string
  description: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "actualite",
    label: "Actualité",
    description:
      "L'information générale et les faits marquants qui touchent directement la société.",
  },
  {
    slug: "investigations",
    label: "Investigations",
    description:
      "Des enquêtes sur des faits et des situations d'intérêt public, vérifiées et recoupées.",
  },
  {
    slug: "debats-emissions",
    label: "Débats et émissions",
    description:
      "Émissions, débats et entretiens consacrés à l'actualité et aux grands enjeux de société.",
  },
  {
    slug: "action-citoyenne",
    label: "Action citoyenne",
    description:
      "Les initiatives citoyennes et les actions qui contribuent à l'amélioration de la société.",
  },
]

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

export function isValidCategory(slug: string): slug is CategorySlug {
  return CATEGORIES.some((c) => c.slug === slug)
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}
