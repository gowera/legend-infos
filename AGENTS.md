# AGENTS.md

## Architecture

LEGEND est une SPA React 19 et Vite avec Tailwind CSS 4. Le routage client léger est défini dans `src/lib/router.tsx` et les vues sont assemblées dans `src/App.tsx`. Il n'y a ni TanStack ni rendu serveur.

Les articles publics sont lus depuis l'API REST WordPress dans `src/lib/wordpress.ts`. L'application ne détient aucun identifiant WordPress : la création et la gestion des articles se font dans l'administration WordPress.

## Structure

```
index.html                 # Entrée HTML de Vite
public/                    # Logo, photo du micro et règle Apache pour le fallback SPA
src/
  App.tsx                  # Sélection de la vue selon l'URL
  main.tsx                 # Démarrage React
  components/              # En-tête, pied de page, partage et cartes d'articles
  lib/
    router.tsx             # Navigation History API pour la SPA
    wordpress.ts           # Lecture et validation des réponses WordPress REST
    useArticles.ts         # Chargement des listes et détails d'articles
    categories.ts          # Rubriques et leurs slugs WordPress attendus
  routes/                  # Composants de pages (accueil, article, rubrique, à propos)
```

## Conventions

- Le site public est en lecture seule. Ne jamais intégrer de mot de passe, jeton WordPress ou clé privée dans le code client ou une variable `VITE_*`.
- `VITE_WORDPRESS_URL` est une URL publique sans secret. L'API REST utilisée est `/wp-json/wp/v2/posts`; les catégories et images mises en avant sont lues avec `_embed`.
- Les slugs de catégories WordPress doivent correspondre à `src/lib/categories.ts`.
- Les réponses d'API et les erreurs doivent être affichées explicitement ; ne pas masquer les erreurs réseau ou de configuration derrière des données fictives.
- L'alias `@/*` pointe vers `src/*`.
- Les règles de réécriture dans `public/.htaccess` et `netlify.toml` doivent rester cohérentes avec le fallback SPA.

## Données historiques

Les articles et images précédemment stockés dans Netlify ne sont pas versionnés dans Git. Une migration vers WordPress exige un export explicite de Netlify Database et Netlify Blobs ; ne pas prétendre que le clonage du dépôt a récupéré ces données.
