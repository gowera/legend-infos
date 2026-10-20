import type { User, UserLoginEvent, UserSignupEvent } from "@netlify/functions"
import { OWNER_ROLE } from "../../src/lib/owner"

// Les utilisateurs invités depuis le tableau de bord Netlify (Identity > Invite
// users) reçoivent automatiquement le rôle `owner` pour pouvoir publier.
// Les inscriptions spontanées (sans invitation) ne sont pas concernées.
function withOwnerRole(user: User) {
  if (!user.invitedAt) return undefined
  const roles = Array.isArray(user.appMetadata?.roles)
    ? (user.appMetadata.roles as string[])
    : []
  if (roles.includes(OWNER_ROLE)) return undefined
  return {
    user: {
      ...user,
      appMetadata: { ...user.appMetadata, roles: [...roles, OWNER_ROLE] },
    },
  }
}

export default {
  // Acceptation d'une invitation.
  userSignup(event: UserSignupEvent) {
    return withOwnerRole(event.user)
  },
  // Rattrapage pour les invités ayant accepté avant l'ajout de cette fonction.
  userLogin(event: UserLoginEvent) {
    return withOwnerRole(event.user)
  },
}
