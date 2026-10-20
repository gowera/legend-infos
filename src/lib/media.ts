// Photo de micro utilisée pour la bannière d'accueil et comme image par défaut des articles.
export const MICRO_IMAGE = "/micro.jpg"

export function microImageUrl(width: number, height?: number) {
  const size = height ? `&w=${width}&h=${height}` : `&w=${width}`
  return `/.netlify/images?url=${MICRO_IMAGE}${size}&fit=cover&fm=webp`
}
