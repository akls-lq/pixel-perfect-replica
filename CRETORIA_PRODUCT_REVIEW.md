# Crétoria — audit produit et revue du bloc de logos

Audit de `feat/cretoria-v2`, après récupération du commit propriétaire `0aedfcf`. Les éléments ci-dessous sont séparés entre constats vérifiés, recommandations et modification effectuée. `main` n’est pas modifiée.

## Constats vérifiés dans le code

Crétoria est un prototype front-end structuré : React/TypeScript, TanStack Start/Router, Tailwind, Radix et Recharts. La navigation et les pages sont distinctes, les préférences sont persistantes, les filtres disposent d’un brouillon annulable et les états indisponibles sont généralement explicites. Ces bases sont réutilisables ; aucune migration de framework n’est justifiée pour le MVP.

Les providers de `src/components/workspace/WorkspaceContext.tsx` conservent candidatures, comptes et fichiers en mémoire. `src/lib/workspace-data.ts`, `src/lib/autopilot-usage.ts` et `src/lib/account-data.ts` contiennent les exemples et dates de référence. Les seuls usages de localStorage identifiés concernent les préférences et critères. La recherche de code métier serveur n’a pas révélé d’intégration d’authentification, de base de données, de moteur de recherche ou de génération IA ; `src/server.ts` est un wrapper SSR. Il ne faut donc pas interpréter une interface fonctionnelle comme une intégration réelle.

Le dashboard calcule correctement des indicateurs sur les exemples, mais « total » et « envoyées » sont identiques car le jeu actuel représente des dossiers fictifs déposés. Cela ne définit pas encore un cycle de candidature réel. Les activations et séries sont des mocks arrêtés au 28 octobre 2026. Les recherches Autopilote ne lancent aucune opération externe et n’affichent plus d’offres fictives.

La bibliothèque CV limite à trois fichiers et vérifie taille, extension et signature, sans parseur complet ni antivirus. Les documents rattachés restent locaux et ne représentent pas des pièces déjà transmises. Le répertoire employeur propose encore un champ de mot de passe et une copie, exclusivement fictifs. Le profil indique l’absence d’authentification ; la présentation des paiements est explicitement future.

La présentation publique `/presentation` conserve des formulations plus avancées que le produit : préparation Autopilot, IA, XP et missions. `src/components/site/content.ts` promet notamment que le gestionnaire de comptes conserve uniquement des métadonnées, alors que l’interface de démonstration montre aussi un mot de passe fictif. Ce n’est pas un stockage de vrais identifiants, mais le positionnement est incohérent. `roadmap.md` reste centré sur l’ancien plan et ne décrit pas précisément l’étendue du front-end actuel. Ces éléments n’ont pas été modifiés dans cette mission.

## Diagnostic produit

La valeur la plus immédiatement livrable est l’organisation de la recherche : retrouver une offre, son lien source, son statut et les documents associés. Une automatisation transversale à de nombreux sites employeurs impose des dépendances beaucoup plus lourdes : autorisations, formats, données personnelles, contrôle des doublons et fiabilité des confirmations d’envoi.

Le premier MVP devrait donc être un espace privé de suivi et de préparation, avec une importation manuelle d’offre par URL et des dossiers persistants. Son critère de réussite : un utilisateur retrouve sur deux appareils le même dossier, son historique et la bonne version de ses pièces, sans fuite entre comptes. Ni soumission automatique, ni messagerie, ni facturation ne sont nécessaires pour valider cette valeur initiale.

La mascotte, l’indigo et le turquoise peuvent porter une identité propre. Une hiérarchie plus nette entre « réel », « exemple » et « futur » serait plus utile qu’une nouvelle refonte. Les paiements et la présentation d’un coffre de mots de passe sont secondaires à ce stade. Les séries doivent valoriser la préparation, sans pression quotidienne ni récompense du volume d’envois.

## Recommandations non implémentées

Efforts indicatifs : S = 1–3 jours, M = 1–2 semaines, L = plusieurs semaines pour une petite équipe ; ce sont des ordres de grandeur, pas des engagements.

| Problème | Amélioration | Bénéfice | Priorité | Effort | Dépendance |
| --- | --- | --- | --- | --- | --- |
| Messages publics plus ambitieux que les fonctions disponibles | Harmoniser présentation, FAQ et étiquettes « prototype », supprimer les promesses non connectées ; actualiser la roadmap | Confiance et compréhension immédiate | P0 | S | Validation du positionnement |
| Dossiers et documents perdus au rechargement | Authentification, données propriétaires par compte, persistance et stockage privé des pièces | Premier service réellement utilisable et retrouvable | P0 | L | Choix de fournisseur, modèle de données, tests d’isolation |
| Dossiers tous fictifs et cycle métier incomplet | Création/import manuel d’une offre par URL, source obligatoire, statuts « à préparer / préparée / envoyée », événements horodatés et snapshots des pièces | Suivi fiable sans automatisation prématurée | P0 | M | Persistance et définition des états |
| Faux coffre de mots de passe pouvant être mal compris | Réduire le répertoire à l’URL du portail, email, lien de réinitialisation et notes ; recommander le gestionnaire de mots de passe de l’utilisateur | Utilité conservée avec beaucoup moins de risque | P0 | S–M | Décision produit sur le répertoire |
| Pas de preuve d’utilité sur des parcours réels | Tester le MVP avec un petit groupe de candidats ciblés et mesurer la récupération des dossiers, les oublis et le temps de préparation | Priorisation fondée sur les usages | P0 | M | Segment cible et consentement des testeurs |
| Absence de source d’offres | Ajouter ensuite un connecteur autorisé, avec provenance, expiration et dédoublonnage ; garder l’import manuel | Offres fiables et traçables | P1 | M–L | Autorisation et documentation de la source |
| Matching seulement illustratif | Score déterministe explicable : compétences, contrat, lieu, éléments inconnus, correction par l’utilisateur | Priorisation compréhensible sans fausse garantie | P1 | M | Profil validé et données d’offre structurées |
| CV non conservés et versions non figées | Versions de documents par dossier, prévisualisation, export et suppression, puis assistance rédactionnelle facultative | Évite d’associer le mauvais document à une candidature | P1 | M–L | Stockage privé et modèle des versions |
| Activités et taux pouvant être confondus | Définir les événements et dénominateurs, distinguer accusé automatique/réponse humaine, marquer les données manquantes | Indicateurs réellement actionnables | P1 | M | Modèle d’événements et sources fiables |
| Automatisation future complexe | Commencer par une file de préparation et de validation, puis une seule intégration officiellement permise | Apprentissage progressif, envois maîtrisés | P2 | L | Autorisation, identité, documents et audit des actions |
| Paiements et fonctionnalités annexes avant validation | Reporter facturation et extension ; améliorer d’abord rétention et organisation | Réduit la dispersion | P2 | S pour cadrage | Retours des premiers utilisateurs |

## Sources, matching et Autopilote

Pour les sources, examiner les API/flux d’employeurs ou d’ATS dont les conditions permettent l’usage envisagé, ainsi qu’un éventuel fournisseur de données sous licence. Une page publique ou une API techniquement accessible ne prouve pas un droit de redistribution ou de soumission. Aucun accès ni accord de LinkedIn, Indeed, HelloWork ou Glassdoor n’a été vérifié dans cet audit. Une offre importée doit garder son URL, sa provenance, sa date de récupération et son éventuelle expiration.

Le matching doit afficher les raisons, les inconnues et les critères bloquants, sans inventer de compétence ou garantir un entretien. Pour une première version, un modèle explicable simple est préférable à une intégration IA non mesurée. Si une IA intervient ensuite, elle doit travailler sur un profil corrigé par le candidat et ne produire que des brouillons révisables.

L’Autopilote devrait d’abord organiser : sélection, contrôle des doublons, préparation, relecture et approbation explicite. Une candidature préparée n’est pas une candidature envoyée. Une future soumission ne peut être déclarée réussie qu’après une confirmation fiable, avec statut d’échec ou d’incertitude et journal d’audit. Ne pas contourner un contrôle d’accès, CAPTCHA ou restriction d’un site.

## Compte fournisseur et données personnelles

Le besoin utilisateur est surtout de retrouver où il a un compte et quel email il utilise. Stocker ses mots de passe n’est pas nécessaire à ce besoin. Conserver de préférence uniquement des métadonnées et laisser les secrets au gestionnaire de mots de passe de l’utilisateur. Une solution coffre future serait un projet de sécurité séparé, avec chiffrement, authentification forte, récupération, contrôle d’accès et audit ; elle ne doit pas être improvisée en ajoutant une colonne password à une base.

Avant des CV réels sur serveur : authentification, autorisation systématique par propriétaire, stockage privé, liens temporaires, validation serveur et contrôle des fichiers, chiffrement en transit et au repos, journaux sans contenu de CV ni secrets, rétention explicite, export et suppression effective. Définir les sous-traitants, régions d’hébergement et usages des documents. Éviter toute transmission à un prestataire IA sans information et choix explicites. Le prototype local ne démontre pas encore ces garanties.

## Roadmap proposée

1. **Clarification front-end** : synchroniser les textes et la roadmap, rendre les limites cohérentes, définir le parcours principal et les états.
2. **MVP privé** : authentification, isolation des données, stockage privé, dossiers manuels et versions de documents ; tester l’accès entre utilisateurs et les suppressions.
3. **Offres et matching** : un connecteur autorisé, dédoublonnage et expiration, puis matching explicable sur profil validé.
4. **Assistance contrôlée** : brouillons et file d’approbation ; messagerie facultative via consentements limités si le besoin est confirmé.
5. **Automatisation limitée** : une intégration explicitement permise, confirmations traçables, reprise sur erreur et validation utilisateur. Facturation seulement après validation de l’utilité.

Questions qui bloquent certaines décisions : quel segment prioritaire (stage/alternance, premier emploi, reconversion) et quel pays ? Quel parcours est le plus pénible aujourd’hui ? Quelles sources sont réellement autorisées ? Quel fournisseur et quelle région pour les données ? Quels budget, délais, effectifs et volume ? Quelle politique de rétention ? Quels objectifs et consentements pour une éventuelle IA ou messagerie ? Quels retours d’utilisateurs existent déjà ?

## Modification réellement effectuée : logos uniquement

La page publique est `/presentation` ; `/` reste le dashboard. Aucun bloc d’entreprises n’existait sur la page publique inspectée. Un composant isolé a été ajouté après le hero, sans déplacement des sections existantes. Aucun autre écran métier n’est modifié.

Titre affiché : « Ton prochain chapitre pourrait commencer chez… ». Aucun parcours candidat vérifié ne justifie « Ils ont décroché une opportunité chez… ». La mention « Exemples d’employeurs · Aucun partenariat ni recrutement revendiqué » rend le positionnement explicite.

Quinze SVG locaux de marques, avec provenance et empreintes dans `src/assets/companies/README.md`. Cinq emplacements fixes sur ordinateur, trois sur mobile ; les logos changent par groupes. Cadence : 3,2 secondes, transition verticale de 500 ms, flou de 5 px et décalage de 90 ms par colonne. Pas de défilement horizontal. Hauteur de rangée fixe. Bouton pause/reprise, affichage statique si mouvement réduit, arrêt des timers hors champ ou onglet masqué, liste accessible stable sans annonces répétées.

Fichiers : `src/components/landing/CompanyLogos.tsx`, `CompanyLogos.module.css`, `company-logos.ts`, les SVG locaux et une inclusion dans `src/routes/presentation.tsx`. Aucun backend, service d’image à l’exécution ou dépendance supplémentaire.

## Vérifications et limites

- `tsc --noEmit` réussi ; `npm test` : 27 tests réussis sur quatre fichiers ; `npm run lint` : aucune erreur, six avertissements React Refresh préexistants ; `NITRO_PRESET=vercel npm run build` réussi.
- Appel direct de la fonction Vercel compilée : HTTP 200 sur `/presentation` et `/`, nouveau bloc présent uniquement sur la page publique.
- Parcours Chromium : chargement des SVG locaux, cinq/trois emplacements, boucle, délais, dimensions constantes, pause et mouvement réduit, thèmes/langue, contrôle Axe limité au nouveau bloc, absence du composant sur le dashboard.
- Les contrôles visuels et automatiques ne constituent pas une certification d’accessibilité complète. Le reste de la page publique n’a pas été refondu ni certifié dans cette tâche.
- Le déploiement distant n’est pas confirmé ; le blocage Vercel de l’auteur du commit reste distinct du build. Aucune identité Git n’est modifiée pour le contourner.

## Cinq actions suivantes

1. Choisir le segment candidat et valider un parcours principal avec des testeurs.
2. Harmoniser les promesses publiques et formaliser les états réels/préparés/envoyés.
3. Décider de l’authentification, de l’isolation des dossiers et du stockage privé avant tout CV réel sur serveur.
4. Livrer puis tester un suivi persistant avec import manuel par URL et documents versionnés.
5. Identifier une source d’offres autorisée et mesurer un matching explicable avant toute automatisation d’envoi.
Validation du bloc de logos pour prévisualisation.
Validation de la présentation simplifiée et des trois bibliothèques de documents.
Validation du filtre de statut et du nettoyage de l’accueil et de l’Autopilote.
