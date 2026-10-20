# LEGEND

LEGEND est un média d'information en ligne dédié à l'actualité, à l'investigation, au débat public et à l'action citoyenne.

## Fonctionnalités

- SPA React/Vite avec navigation côté client.
- Accueil, rubriques, pages d'articles et page « À propos ».
- Lecture des articles publiés et de leurs images via l'API REST publique de WordPress.
- Partage des articles par WhatsApp et Facebook.
- Publication gérée depuis l'administration WordPress ; le site public reste en lecture seule.

## Développement local

Prérequis : Node.js et pnpm.

```bash
pnpm install
```

Copiez `.env.example` vers `.env.local` si vous souhaitez remplacer la configuration locale. `VITE_WORDPRESS_URL` contient l'adresse du site WordPress. La production est configurée pour `https://legend-infos.com`.

L'API est appelée avec le paramètre WordPress standard `?rest_route=/wp/v2/posts`, car la route `/wp-json/` renvoie actuellement une erreur 500 sur cet hébergement.

```bash
pnpm dev
```

Ouvrez `http://localhost:3000`. Pour vérifier la version de production :

```bash
pnpm build
pnpm preview
```

## Configuration WordPress

- L'API REST WordPress doit être activée et permettre la lecture publique des articles.
- Les articles doivent être publiés dans la taxonomie WordPress « Catégories » avec les slugs `actualite`, `investigations`, `debats-emissions` ou `action-citoyenne`.
- L'image mise en avant de l'article est utilisée comme visuel. Sans image, le site affiche `public/micro.jpg`.
- Si la SPA est hébergée sur un autre domaine que `legend-infos.com`, configurez CORS dans WordPress pour autoriser l'origine exacte du site LEGEND. Sans cet en-tête, les navigateurs bloquent les requêtes. L'API répond actuellement sans en-tête CORS ; un hébergement de la SPA sur `legend-infos.com` évite cette restriction en production.
- Aucun identifiant WordPress ni mot de passe ne doit être placé dans les variables `VITE_*` : ces valeurs sont intégrées au code public.

La route `/publier` indique que la publication se fait dans WordPress. Les rédacteurs publient et gèrent les articles depuis l'administration WordPress, pas depuis la SPA.

## Hébergement

```bash
pnpm build
```

Le site statique est généré dans `dist/`. Téléversez le contenu de ce dossier à la racine de l'hébergement. Le fichier `public/.htaccess` est copié dans `dist/` et redirige les routes de la SPA vers `index.html` sur les hébergements Apache. `netlify.toml` contient la règle équivalente pour Netlify.

Spa Loader Pro transmet le chemin de déploiement via `SPA_LOADER_BASE_PATH`. Vite intègre ce chemin dans les URL du HTML et des assets ; le routeur et les images publiques utilisent le même préfixe. Pour un build manuel dans un sous-dossier, définissez par exemple `SPA_LOADER_BASE_PATH=/app/legend-infos/` avant `pnpm build`.

## Migration des anciens articles Netlify

Le dépôt Git contient le code et les images de base, mais pas les articles publiés ni les photos enregistrées dans Netlify Database/Blobs. Leur import WordPress nécessite un export des données et des médias depuis l'ancien site Netlify. Aucun identifiant ou export de ces services n'est inclus dans ce dépôt.
