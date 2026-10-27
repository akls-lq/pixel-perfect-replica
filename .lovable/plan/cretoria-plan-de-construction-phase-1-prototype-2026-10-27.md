# CRETORIA — Plan de construction (Phase 1 : prototype)

Le cahier des charges couvre 3 phases. Ce plan construit la **Phase 1** en un vrai parcours utilisable, découpé en étapes vérifiables. Les phases 2 et 3 (sources d'offres sous licence, Stripe, extension Chrome réelle, emails) restent hors périmètre et seront signalées comme « à venir » dans l'interface, sans faux boutons.

## Direction artistique
- Bleu nuit profond, blanc cassé, accents indigo/violet, turquoise pour les actions.
- Titres éditoriaux en serif moderne (Instrument Serif) + texte en Manrope.
- Cartes aérées, icônes Lucide, animations discrètes, skeletons et états vides/erreur partout.
- Tous les tokens dans le système de design (pas de couleurs en dur).

## Étape 1 — Landing page publique
- `/` : header responsive, hero (titre et sous-titre fournis), problème, matching IA, Autopilot, carte, CV Studio, suivi, extension, 3 étapes, comparatif, tarifs Free/Pro marqués « projet de tarification », FAQ, appel final, footer.
- Pages séparées : `/tarifs`, `/faq`, `/contact`, `/confidentialite`, `/conditions`, `/mentions-legales`.
- Visuel du dashboard généré. Aucune statistique, avis ou logo inventé.

## Étape 2 — Comptes et onboarding (Lovable Cloud)
- `/login`, `/register`, `/reset-password` (email + mot de passe, Google).
- `/onboarding` multi-étapes avec progression sauvegardée : import CV PDF, extraction IA des données, validation/correction manuelle, métiers, contrats, lieux, télétravail, salaire, disponibilité, compétences, langues, exclusions.
- Zone `/app/*` protégée.

## Étape 3 — Offres et matching
- Jeu d'offres de démonstration clairement étiquetées « Démo » (en base), avec source, date de vérification, offres expirées, coordonnées réelles ou absentes.
- `/app/jobs` : recherche, filtres (pays, ville, contrat, télétravail, salaire, expérience, date), tri, sauvegarde, masquage, historique de recherche.
- Score de compatibilité explicable (compétences présentes/manquantes/incertaines, lieu, contrat, langues), avec mention « estimation, pas une garantie ».
- `/app/jobs/$id` : détail complet + Sauvegarder / Préparer ma candidature / Voir l'original.

## Étape 4 — CV Studio et lettres (IA)
- `/app/cv-studio` : profil structuré éditable, modèle ATS une colonne, version ciblée par offre, comparaison avant/après surlignée, historique des versions, export PDF.
- `/app/documents` : lettre personnalisée (ton, langue), édition, versions, réponses courtes aux questions de formulaire, export PDF.
- Garde-fou : l'IA reformule uniquement à partir du profil réel ; aucune invention.

## Étape 5 — Suivi des candidatures
- `/app/applications` : Kanban, tableau, calendrier, filtres, recherche, export CSV, 10 statuts.
- `/app/applications/$id` : fiche complète (documents exacts, mode, historique horodaté, notes, échéances, confirmation d'envoi).
- Règle : une candidature préparée n'est jamais comptée comme envoyée.

## Étape 6 — Autopilot (mode démonstration)
- `/app/autopilot` : règles (métiers, lieux, score minimum, limite/jour, exclusions), Activer/Pause, exécution qui filtre, dédoublonne, prépare CV + lettre et alimente une file d'approbation.
- Relire/modifier/accepter/refuser ; statuts complets ; journal et erreurs.
- Aucun envoi réel en Phase 1 : « envoi » simulé, marqué non confirmé.

## Étape 7 — Dashboard, carte et compléments
- `/app/dashboard` : indicateurs calculés sur les vraies données, actions à approuver, activité Autopilot, raccourcis.
- `/app/map` : MapLibre, clusters, aperçu au clic, liste synchronisée, recherche ville/pays, rayon, section dédiée remote et « sans localisation fiable ».
- `/app/extension` : page produit + formulaire de démo contrôlé par Cretoria montrant le préremplissage avec aperçu et validation finale par l'utilisateur.
- `/app/contacts` (ajout manuel, brouillon de relance IA, anti-double relance), `/app/accounts` (métadonnées seulement, jamais de mot de passe), `/app/profile` (complétude), `/app/settings` (export et suppression des données).

## Détails techniques
- TanStack Start, Tailwind v4, shadcn ; Lovable Cloud pour auth, base, stockage (bucket privé pour les CV) ; Lovable AI pour extraction CV, matching explicatif, génération CV/lettre/relance via fonctions serveur authentifiées.
- Tables : profiles, experiences, education, skills, resumes, resume_versions, cover_letters, job_sources, jobs, job_matches, saved_jobs, hidden_jobs, search_history, applications, application_events, application_documents, recruiter_contacts, follow_ups, autopilot_rules, autopilot_runs, autopilot_queue, job_platform_accounts, notifications. RLS propriétaire partout ; offres démo en lecture pour les connectés, insérées via migration.
- Score de matching calculé de façon déterministe (testé), l'IA ne fournit que l'explication textuelle.
- Tests : score de matching, règle « préparée ≠ envoyée », limite quotidienne Autopilot.
- Architecture prête pour l'anglais (textes centralisés).

## Hypothèses à confirmer
- Phase 1 seulement ; l'extension Chrome reste une page + démo intégrée (pas de module séparé pour l'instant).
- Fond de carte libre (OpenFreeMap) sans clé.
- Les offres sont de démonstration tant qu'aucune source autorisée n'est connectée.

## Première étape
Système de design + landing page complète, puis activation de Lovable Cloud et onboarding.
