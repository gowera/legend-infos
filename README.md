# LEGEND

LEGEND est un média d'information en ligne dédié à l'actualité, à l'investigation, au débat public et à la promotion de l'action citoyenne. Ce dépôt contient le site public ainsi qu'un espace de publication permettant à la rédaction de mettre en ligne de nouveaux articles avec leur photo.

## Fonctionnalités

- Page d'accueil avec les derniers articles et présentation de la ligne éditoriale (Investigations, Débats et émissions, Action citoyenne).
- Pages par rubrique et page de détail pour chaque article.
- Page "À propos" reprenant la mission, les valeurs et l'engagement de LEGEND.
- Espace de publication (`/publier`) : formulaire pour créer un article (titre, résumé, contenu, rubrique, auteur, photo), réservé au propriétaire du site (connexion Netlify Identity).
- Les articles et leurs photos sont stockés de façon persistante (base de données + stockage d'images Netlify), donc visibles immédiatement par tous les visiteurs après publication.

## Technologies

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router) avec Vite
- Tailwind CSS 4
- Netlify Database (Postgres géré) via Drizzle ORM, pour stocker les articles
- Netlify Blobs, pour stocker les photos des articles
- Netlify Identity, pour réserver la publication au propriétaire
- Netlify Image CDN, pour l'optimisation des images affichées sur le site

## Développement local

```bash
pnpm install
pnpm dev
```

Le serveur de développement démarre sur `http://localhost:3000`. Pour bénéficier de l'émulation complète des fonctionnalités Netlify (base de données, stockage d'images), utilisez plutôt :

```bash
netlify dev
```

## Espace de publication

Seul le propriétaire du site peut publier. La page `/publier` demande de se connecter avec un compte Netlify Identity, et le serveur vérifie que ce compte possède le rôle `owner` avant d'enregistrer un article. Le bouton « Publier » de l'en-tête n'apparaît que pour le propriétaire connecté.

Pour créer le compte propriétaire (une seule fois) :

1. Dans le tableau de bord Netlify, ouvrez **Identity** et cliquez sur **Invite users** ; saisissez votre email.
2. Ouvrez le lien reçu par email : il mène à l'espace de publication, où vous choisissez votre mot de passe.
3. De retour dans **Identity**, cliquez sur votre compte et ajoutez le rôle `owner` dans le champ **Roles**, puis enregistrez.
4. Recommandé : dans **Project configuration > Identity**, passez l'inscription en **Invite only** pour que personne d'autre ne puisse créer de compte.

Les rôles ne peuvent être attribués que depuis le tableau de bord Netlify : un visiteur qui créerait un compte ne pourrait donc pas publier.

## Photo du micro

La photo `public/micro.jpg` (libre de droits, Unsplash) sert de fond à la bannière d'accueil et d'image par défaut pour les articles publiés sans photo.

## Structure du projet

Voir `AGENTS.md` pour le détail de l'architecture et des conventions du code.
