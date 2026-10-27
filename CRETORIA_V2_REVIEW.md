# Cretoria V2 — revue de la première phase

Branche : `feat/cretoria-v2`. Aucune fusion ni publication sur main.

## Parcours livré

- Landing SaaS : hero, recherche métier/ville/contrat, aperçu React interactif, offres et explication du matching, Autopilot, CV Studio, suivi, progression, tarifs et FAQ.
- `/app/dashboard` : navigation horizontale responsive, objectif candidat validé, offres sauvegardées, matching dépliable, missions, XP, niveaux, badge et remise à zéro.
- Pages publiques conservées, accès à la démo depuis le header desktop et mobile.
- Recherche et sélections locales fonctionnelles. Les points correspondent à la validation d'un objectif, à une sauvegarde et à l'ouverture d'une explication. Chaque mission est récompensée une seule fois par session.

## Limites explicites

Toutes les offres, entreprises, scores et cartes de candidatures sont fictifs. Les scores sont prédéfinis, sans calcul sur le profil saisi. Les états vivent en mémoire et sont perdus au rechargement. Les onglets de l'espace changent le panneau sur `/app/dashboard`, sans URL séparée par onglet.

CV Studio compare deux textes prédéfinis ; Autopilot modifie uniquement sa file d'exemple ; le Kanban déplace uniquement des cartes fictives. Aucun envoi, génération IA, compte, backend, notification, messagerie ni extension Chrome. Carte et messages ont des états d'indisponibilité explicites. Les tarifs décrivent un projet non commercialisé. Les polices distantes restent facultatives avec une police système de secours.

## Fichiers concernés

- `src/routes/index.tsx` : refonte de la landing.
- `src/routes/app.dashboard.tsx` : nouvel espace de démonstration.
- `src/components/app/Progress.tsx` : progression accessible, missions, XP, niveaux et badge.
- `src/components/landing/{HeroSearch,OffersSection,ProductPreview,FeatureDemos,shared}.tsx` : réutilisation, clarification des démos, accessibilité de l'aperçu et formatage.
- `src/components/site/{SiteLayout,content,demo-data}.ts(x)` : accès à la démo, contenu honnête sur les données, formatage.
- `src/styles.css` : palette, contrastes et styles partagés.
- `src/routeTree.gen.ts` : route générée par TanStack.
- `src/routes/{__root,conditions,confidentialite,faq,mentions-legales,tarifs}.tsx` : formatage pour corriger le lint existant.
- `src/test/demo-workflow.test.tsx` : tests de filtrage, approbation sans envoi et progression.

## Prévisualisation

Depuis `/workspace/pixel-perfect-replica` :

```sh
npm run dev -- --host 0.0.0.0 --port 3000
```

Ouvrir le serveur via l'outil de prévisualisation de votre environnement, puis visiter `/` et `/app/dashboard`. Aucun secret nécessaire. Pour réinstaller sans modifier le verrou : `BUN_INSTALL_CACHE_DIR=/workspace/.bun-cache /workspace/.cloud-tools/node_modules/.bin/bun install --frozen-lockfile`.

## Validation

- `npm test` : 4 tests, 2 fichiers, réussis.
- `./node_modules/.bin/tsc --noEmit` : réussi.
- `npm run lint` : aucune erreur, 6 avertissements React Refresh préexistants dans les composants UI.
- `npm run build` : compilation client, SSR et worker Cloudflare réussie ; aucun déploiement.
- Chromium via Playwright : recherche, filtre vide, navigation de tous les panneaux, profil, sauvegarde, XP sans duplication, badge, réinitialisation et six routes publiques validés.
- Captures desktop 1440 px et mobile 390 px inspectées. Aucun débordement horizontal détecté pour la landing et le dashboard ; menu mobile testé. Polices Google bloquées par le réseau de test, rendu vérifié avec police de secours.
- Script navigateur et captures de cette session : `/workspace/review-cretoria/` (hors dépôt).

Les fichiers restent disponibles en diff sur la branche pour revue. Aucun push ni changement des dépendances ou du verrou.

## Préparation Vercel

`vercel.json` fixe l’installation Bun 1.4.4 avec verrou gelé et le build `NITRO_PRESET=vercel npm run build`. Ce build a été exécuté avec succès et produit `.vercel/output/config.json`, les fichiers statiques et la fonction serveur. `.vercel/` est ignoré par Git. Dans Vercel, utiliser Node.js 24 et le répertoire racine du dépôt ; supprimer tout ancien override de répertoire de sortie tel que `dist`. Le déploiement distant et la disponibilité publique ne sont pas validés. Le domaine fourni est bloqué par la politique réseau de cette session (proxy HTTP 403).
Prévisualisation Vercel demandée par le propriétaire du projet.
