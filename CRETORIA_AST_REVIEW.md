# Crétoria — interface lavande, thèmes et Autopilote

Refonte front-end sur `feat/cretoria-v2`. Aucun changement de backend, API, authentification, base de données, paiement ou moteur de candidature. Le commit propriétaire `0fb0899` a été conservé avant le travail.

## Références examinées

Les quinze captures de l’archive et les images extraites de la vidéo ont été examinées avant l’implémentation. Les dashboards AST Prep clair/sombre guident les proportions, les cartes, la sidebar et la courbe violette ; MyICN guide les contrôles de langue et le menu avatar ; JobTeaser guide la barre et la modale de critères. Aucun nom, logo, compteur commercial ou contenu tiers n’est repris dans l’application.

## Ce qui change

- Sidebar dans l’ordre Dashboard, Autopilote, CV, Suivi, Compte fournisseur ; réduction sur desktop et drawer accessible sur mobile. Header avec titre, recherche de pages, FR/EN, thème et menu utilisateur.
- Thèmes clair lavande et sombre violet profond. Le changement utilise une révélation circulaire depuis le bouton du header avec View Transitions API. Fallback immédiat si indisponible ou mouvement réduit. Langue et thème sont persistés dans `cretoria.preferences` ; aucun secret n’y est stocké.
- Dashboard : courbe violette d’heures activées, agrégations Jour/Semaine/Mois, série courante et record, calendrier, KPIs, activité récente et répartition des statuts. Une liste textuelle accompagne les valeurs du graphique.
- Autopilote à l’URL existante `/app/offers` : recherche mots-clés/entreprise et ville/département/région, contrat multisélection, modale « Plus de critères » avec les catégories demandées. Les choix sont OR dans une catégorie et AND entre catégories. Appliquer confirme ; Échap/croix/overlay annulent le brouillon ; Tout effacer réinitialise les sélections du brouillon. Les chips retirent un critère appliqué. Les critères sont conservés dans `cretoria.criteria` et validés à la restauration. Aucun appel moteur ; « Lancer la recherche » affiche uniquement l’état de démonstration demandé.
- Bibliothèque de trois CV PDF/DOC/DOCX : sélection multiple, glisser-déposer, remplacement, suppression, format/taille et messages de validation. Les documents restent en mémoire et disparaissent au rechargement. Le premier CV reste accessible par l’alias existant utilisé par les dossiers de suivi.
- Suivi : dossiers et mises à jour existants conservés ; filtres combinés période, poste, entreprise, contrat et localisation, plus emails signalés. Les champs contrat/localisation sont joints via les offres existantes. « En attente » et « Sans réponse » utilisent l’absence de réponse renseignée ; « Envoyées » désigne les dossiers de démonstration déposés. « En traitement », « Acceptées » et le type de candidature restent désactivés faute de données ; « Offre reçue » ne prétend pas signifier « Acceptée ».
- Compte fournisseur : données, ajout, génération, masquage/révélation, copie et suppression conservés. Styles adaptés et libellés traduits sans ajouter de stockage de mots de passe.
- `/app/profile` : état visiteur, email et identifiant non disponibles, sans inventer une identité. `/app/settings` : apparence, langue et présentation de Visa, Mastercard, Apple Pay et PayPal. Stripe reste décrit comme prestataire futur. Aucun paiement, donnée bancaire ou abonnement actif simulé.
- Loader provisoire : composant vectoriel Créto de profil, foulées alternées et poussière. Affiché pendant la lecture effective des CV et comme pendingComponent du routeur, sans délai artificiel. Un sprite de course original de la mascotte pourra remplacer ce dessin provisoire ; aucun sprite animé n’était disponible.

## Démonstration et limites

Les activations de `src/lib/autopilot-usage.ts` sont des mocks explicites, arrêtés au 28 octobre 2026. Les durées et séries ne mesurent pas un Autopilote réel. L’agrégation fusionne les chevauchements, borne les sessions ouvertes à la date de référence, répartit les heures dans le fuseau local et conserve la série si le jour courant n’est pas terminé. Les tests couvrent le changement d’heure et un fuseau à décalage de 45 minutes. Les KPIs utilisent les 42 candidatures fictives existantes.

Le catalogue et les attributs de filtres sont remplaçables, isolés dans `src/lib/autopilot-data.ts`. Certaines combinaisons ne correspondent à aucun des huit exemples, ce qui produit un état vide honnête. Les mois sont générés à partir du mois courant. Les langues des offres sont indépendantes de la langue FR/EN de l’interface. Les noms d’entreprise, postes et contenus des documents restent les données sources, sans traduction automatique ni IA.

La validation des CV porte sur l’extension, la taille (10 Mo), l’absence de fichier vide et la signature de format. Ce n’est ni un parseur Word complet ni un antivirus. Le test DOC utilise une fixture de signature pour tester cette frontière de validation ; le DOCX de test est une archive OOXML minimale. Les mots de passe du compte fournisseur restent des exemples, jamais persistés. Aucun état « connecté » ni bouton de déconnexion opérationnel n’est inventé en l’absence d’authentification.

## Fichiers principaux

- `src/components/preferences/` : préférences, persistance, traductions FR/EN et transition de thème.
- `src/components/workspace/WorkspaceShell.tsx`, `Overview.tsx`, `FilterModal.tsx`, `RunningLoader.tsx`, `Shared.tsx` : coque, dashboard, critères, loader et éléments communs.
- `WorkspaceContext.tsx` et `useWorkspace.ts` : bibliothèque de CV en mémoire et compatibilité des dossiers existants.
- `DocumentPreview.tsx`, `app.accounts.tsx`, `app.applications.$id.tsx` : traductions des interfaces conservées.
- `src/lib/autopilot-data.ts`, `autopilot-usage.ts` : critères typés et calculs de durée/série.
- `src/routes/app.offers.tsx`, `app.cv-studio.tsx`, `app.applications.index.tsx`, `app.profile.tsx`, `app.settings.tsx` : pages concernées.
- `src/styles.css`, `src/routes/__root.tsx`, `src/routeTree.gen.ts` : tokens, providers, pendingComponent et arbre généré.
- `src/test/autopilot.test.ts` : dix tests supplémentaires de calcul, périodes et critères.

## Validation réalisée

- `npm test` : 27 tests réussis, quatre fichiers.
- `tsc --noEmit` : réussi.
- `npm run lint` : aucune erreur ; six avertissements React Refresh préexistants dans les composants UI.
- `NITRO_PRESET=vercel npm run build` : réussi, sortie Vercel avec fonction Node.js 24.
- Chromium / Playwright : révélation circulaire effectivement animée, mouvement réduit, fallback sans View Transitions API, thème et langue après rechargement, modalité/focus/Échap, contrats multiples, brouillon annulé, application et persistance des filtres, chips, compte fournisseur, bibliothèque CV et rattachement au suivi, profil et paramètres.
- PDF, DOCX et frontière de signature DOC, rejet de fichier invalide/vide/trop grand, limite de trois, remplacement, suppression, mémoire entre pages et remise à zéro après rechargement vérifiés.
- Storage navigateur refusé : thème et configuration restent utilisables sans persistance.
- Aucun nouveau POST observé pendant le parcours complet.
- Axe WCAG 2 A/AA et 2.1 AA : aucune violation détectée sur huit pages, dans les deux thèmes, modale ouverte sur Autopilote. Ce contrôle automatique ne constitue pas une certification complète.
- Pas de débordement horizontal à 390 et 768 px sur les sept pages principales, en FR et EN. Drawer mobile et menu utilisateur testés. Captures clair, sombre, mobile et modales inspectées.

Captures et scripts : `/workspace/review-cretoria-v4/` (hors dépôt). Les polices Google sont bloquées dans le réseau de test ; les captures utilisent la police système de secours. Les pages publiques et les URLs existantes sont conservées. Le déploiement distant Vercel n’est pas validé dans cette session ; sa politique sur l’auteur des commits peut toujours demander une action du propriétaire.

Pour lancer localement : `npm run dev -- --host 0.0.0.0 --port 3000` depuis le dépôt, puis ouvrir `/`. Pour la revue visuelle Vercel, utiliser le déploiement de la branche `feat/cretoria-v2`, sans fusion automatique sur `main`.
