# AGENTS.md

Ce document décrit l'architecture du projet LEGEND pour les agents IA et les développeurs qui interviennent dessus.

## Aperçu

Site média (actualité, investigations, débats, action citoyenne) construit avec TanStack Start (React 19 + TanStack Router, Vite) et déployé sur Netlify. Les articles sont créés via un formulaire de publication et stockés dans une base de données Netlify (Postgres géré via Drizzle ORM) ; les photos sont stockées dans Netlify Blobs et servies via l'Image CDN de Netlify.

## Structure

```
db/
  schema.ts        # Table `articles` (Drizzle)
  index.ts         # Client Drizzle (adaptateur Netlify Database)
drizzle.config.ts  # Config drizzle-kit, migrations générées dans netlify/database/migrations
netlify/database/migrations/  # Migrations SQL appliquées automatiquement au déploiement
netlify/functions/
  identity.mts     # Événements Identity : rôle `owner` attribué aux utilisateurs invités
public/
  legend-logo.jpeg # Logo LEGEND fourni par le client
  micro.jpg        # Photo de micro (Unsplash)
src/
  components/
    Header.tsx     # En-tête, navigation, logo
    Footer.tsx     # Pied de page : rubriques, valeurs
    ArticleCard.tsx # Carte d'aperçu d'article (image via Image CDN)
  lib/
    categories.ts           # Rubriques éditoriales (client-safe)
    types.ts                # Type `Article` dérivé du schéma Drizzle
    articles.server.ts      # Accès base de données + Blobs (serveur uniquement)
    articles.functions.ts   # `createServerFn` exposés aux routes/composants
    owner.ts                # Rôle Identity `owner` autorisé à publier (client-safe)
    media.ts                # Photo de micro (bannière + image par défaut)
  routes/
    __root.tsx                 # Layout global (Header/Footer, meta)
    index.tsx                  # Accueil
    a-propos.tsx                # Page mission/valeurs
    categorie.$category.tsx    # Liste d'articles par rubrique
    articles.$slug.tsx          # Détail d'un article
    publier.tsx                  # Formulaire de publication
    api.images.$key.ts          # Sert les photos stockées dans Netlify Blobs
```

## Conventions

- Routage par fichiers TanStack Router, notation à plat avec points pour les segments dynamiques (`categorie.$category.tsx` → `/categorie/$category`), comme dans le template d'origine.
- Toute logique qui touche la base de données ou les secrets vit dans un fichier `*.server.ts` et est exposée au reste de l'app via `createServerFn` (voir `articles.functions.ts`). Les loaders de route restent isomorphes : ils appellent uniquement les fonctions serveur, jamais `db` directement.
- Alias d'import `@/*` → `src/*`.
- Style : Tailwind CSS 4, palette strictement noir et blanc (voir `src/styles.css` pour les polices `font-display`/`font-sans`).

## Base de données

Toute modification du schéma (`db/schema.ts`) doit être suivie d'une migration :

```bash
npx drizzle-kit generate --name <description_du_changement>
```

Les migrations sont appliquées automatiquement par Netlify au déploiement — ne jamais exécuter `drizzle-kit migrate` ou `push` manuellement.

## Espace de publication

`/publier` est réservé au propriétaire : connexion via `@netlify/identity` côté navigateur (login, invitation, réinitialisation du mot de passe), puis `publishArticle` vérifie côté serveur avec `getUser()` que l'utilisateur possède le rôle `owner` (`app_metadata.roles`, attribuable depuis le tableau de bord Netlify) ou que son adresse e-mail confirmée figure dans `OWNER_EMAILS` (`src/lib/owner.ts`). Le lien « Publier » de l'en-tête est masqué pour les autres visiteurs, mais la vraie protection est la vérification serveur. Les utilisateurs invités depuis le tableau de bord Netlify (Identity > Invite users) reçoivent automatiquement le rôle `owner` à l'acceptation de l'invitation (ou à leur prochaine connexion s'ils l'avaient déjà acceptée) via `netlify/functions/identity.mts` ; les inscriptions sans invitation ne reçoivent aucun rôle. L'en-tête redirige vers `/publier` les liens d'invitation/réinitialisation qui arrivent sur la racine.

## Pistes d'évolution possibles

- Ajouter l'édition/suppression d'articles depuis l'espace de publication.
- Ajouter un rôle `redacteur` si d'autres personnes doivent pouvoir publier.
- Ajouter une recherche ou une pagination si le nombre d'articles grandit.
