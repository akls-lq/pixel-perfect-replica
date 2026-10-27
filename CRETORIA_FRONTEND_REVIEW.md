# Crétoria — Front-end orienté recherche d’emploi

Cette revue décrit la refonte suivante à la V2. `main` n’est pas modifiée.

## Pages et comportements

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil : six indicateurs, courbe des envois et réponses, répartition par secteur, graphique des étapes, progression et derniers dossiers. |
| `/app/offers` | Offres sur une page dédiée : critères essentiels visibles, filtres avancés repliables et simulation Autopilot intégrée. |
| `/app/cv-studio` | Ajout d’un CV PDF uniquement, validation du type/signature/taille, ouverture et suppression locales. |
| `/app/applications` | Suivi des dossiers : période, recherche, statut et filtre email. |
| `/app/applications/:id` | Détail : lien de l’annonce, statut, email signalé, notes, CV et lettre consultables/téléchargeables. |
| `/app/accounts` | Répertoire fictif des sites employeurs, emails et mots de passe masqués, révélation, copie, ajout et suppression d’exemples. |
| `/presentation` | Présentation publique précédente conservée. Les pages tarifs, FAQ, contact et légales restent disponibles. |

L’ancienne URL `/app/dashboard` redirige vers `/`. La navigation utilise de vrais liens TanStack avec un onglet actif ; aucune rubrique n’est une section sous l’accueil. « Progression » n’est plus un onglet : la préparation se trouve sur l’accueil.

## Chiffres et cohérence

Les périodes 24 heures, 7 jours, 30 jours et 365 jours s’appliquent à la date de dépôt de candidature. Une même fonction calcule les statistiques de l’accueil et du suivi. Les réponses, refus, entretiens, emails, secteurs et pourcentages viennent des dossiers sélectionnés. Les graphiques disposent de valeurs textuelles accessibles ; le camembert décoratif est doublé d’une légende chiffrée.

Les 42 dossiers et les huit offres sont entièrement fictifs. La référence temporelle affichée est le 27 octobre 2026. Les statuts modifiés dans le suivi mettent à jour les indicateurs de l’accueil. Aucun chiffre ne constitue une statistique commerciale ni une donnée réelle de l’utilisateur.

## Filtres et Autopilot

Métier/compétence, résidence ou ville visée, CDI/CDD/stage/alternance/freelance/intérim, secteur, télétravail, rémunération annuelle minimum, expérience maximum, durée du contrat, temps de travail, diplôme, langue, ancienneté de publication, score illustratif minimum, mois de début, disponibilité immédiate, compétences requises, exclusions et accessibilité renseignée. Ces critères se combinent réellement sur les exemples ; tris par score, date et salaire, sauvegardes et état vide sont opérationnels.

Autopilot reste une simulation explicite de sélection avec les critères actuels : aucune recherche externe, génération de candidature ou soumission réelle. Les scores sont prédéfinis, sans analyse du CV.

Les tentatives de consultation de LinkedIn, HelloWork, Indeed et Glassdoor ont été refusées par le proxy réseau (HTTP 403). L’implémentation suit des conventions connues de recherche d’emploi ; aucune inspection actuelle de ces services n’est revendiquée.

## Fichiers et identifiants

Le CV et les lettres ajoutés restent en mémoire dans cet onglet, sans serveur ni stockage persistant. Les fichiers PDF sont limités à 10 Mo et contrôlés par extension et signature ; ce contrôle ne prétend pas remplacer un antivirus ni un parseur PDF. Les lettres acceptent PDF ou TXT. Un document ajouté peut être rattaché au dossier, consulté et téléchargé ; il est étiqueté « Non envoyé ». Les documents initiaux sont des textes fictifs identiques à l’aperçu et au téléchargement.

Les comptes et mots de passe affichés sont des exemples inventés, avec des adresses example.com. Aucun compte employeur n’a été créé. Les exemples ajoutés traversent les changements de page mais disparaissent au rechargement. Aucun vrai mot de passe ne doit être saisi avant l’implémentation d’un coffre chiffré, de l’authentification et des contrôles d’accès. Le bouton de génération utilise Web Crypto pour produire un exemple long. La copie signale son échec si le navigateur ne l’autorise pas.

## Mascotte

Créto est un personnage original généré pour cette refonte : corps indigo en forme de C, aiguille turquoise, chaussures orange et petit dossier. Image transparente dans `src/assets/creto-mascot.png`, intégrée au logo et à l’accueil. Aucun service tiers n’est appelé pour l’afficher.

## Architecture et fichiers principaux

- `src/components/workspace/` : coque responsive, contexte partagé, graphiques, mascotte, aperçu de document et composants communs.
- `src/lib/workspace-data.ts` : données fictives, périodes, calculs et filtrage. `src/lib/account-data.ts` : exemples de comptes.
- `src/routes/index.tsx`, `app.tsx`, `app.offers.tsx`, `app.cv-studio.tsx`, `app.applications*.tsx`, `app.accounts.tsx`, `app.dashboard.tsx`, `presentation.tsx` : pages et redirection.
- `src/routes/__root.tsx` : contexte partagé autour de l’Outlet existant.
- `src/components/site/SiteLayout.tsx` : liens publics vers les pages dédiées.
- `src/styles.css` : teintes de texte renforcées pour les contrastes des surfaces colorées.
- `src/routeTree.gen.ts` : arbre généré par TanStack.
- `eslint.config.js` : exclusion des sorties générées `.vercel`, `.wrangler`, `.tanstack` du lint ; aucune règle source désactivée.
- `src/test/workspace-data.test.ts` : 13 nouveaux tests de filtres, périodes, statistiques et validation d’URL.

## Vérifications

- `npm test` : 17 tests réussis sur trois fichiers.
- `./node_modules/.bin/tsc --noEmit` : réussi.
- `npm run lint` : aucune erreur ; six avertissements React Refresh préexistants dans les composants UI.
- `NITRO_PRESET=vercel npm run build` : réussi, sortie Vercel et fonction Node.js 24 générées.
- Appel direct de la fonction Vercel compilée : sept pages, HTTP 200 et contenu SSR attendu.
- Chromium / Playwright : périodes, URLs distinctes, filtres combinés et état vide, sélection Autopilot, sauvegarde, upload PDF invalide/valide, rattachement/consultation/téléchargement de documents, validation d’URL, statut et email, propagation aux graphiques, comptes, progression et navigation clavier.
- Rendus desktop inspectés ; absence de débordement horizontal à 390 et 768 px sur six pages. La sélection d’offre sur mobile déplace le focus vers son détail.
- Axe WCAG 2 A/AA et 2.1 AA : aucune violation détectée sur les six pages principales, filtres avancés ouverts. Ceci est un contrôle automatique, pas une certification complète.
- Captures et scripts de la session : `/workspace/review-cretoria-v3/` (hors dépôt).

Les polices Google sont bloquées dans ce réseau : les captures utilisent la police de secours. Aucun backend, envoi de candidature, connexion mail, création de compte externe ou déploiement Vercel distant n’est revendiqué.

## Prévisualisation

Développement depuis le dépôt : `npm run dev -- --host 0.0.0.0 --port 3000`. Le projet conserve `vercel.json` et son build Nitro/Vercel ; la branche de revue est `feat/cretoria-v2`. L’offre actuelle Vercel peut bloquer un commit dont l’auteur n’a pas accès au projet. Aucun changement de plan, de droits ou d’identité Git n’est effectué pour contourner ce contrôle.
Nouvelle refonte prête pour ma revue visuelle sur Vercel.
