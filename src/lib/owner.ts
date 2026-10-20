// Rôle Netlify Identity (app_metadata.roles) réservé au propriétaire du site.
// Il peut être attribué depuis le tableau de bord Netlify.
export const OWNER_ROLE = "owner"

// Adresses e-mail du propriétaire, autorisées à publier même sans le rôle
// `owner` (l'adresse doit avoir été confirmée via l'invitation Identity).
export const OWNER_EMAILS = ["hervemenga32@gmail.com", "hervedeschartes2@gmail.com"]

type OwnerCandidate = { roles?: string[]; email?: string; confirmedAt?: string }

export function hasOwnerRole(user: OwnerCandidate | null | undefined) {
  if (!user) return false
  if (user.roles?.includes(OWNER_ROLE)) return true
  const email = user.email?.trim().toLowerCase()
  return Boolean(email && user.confirmedAt && OWNER_EMAILS.includes(email))
}
