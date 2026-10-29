# Carte et sources d’offres

La page `/app/map` utilise MapLibre GL 5.24.0. La projection passe progressivement
du globe (zoom ≤ 2) au plan Mercator (zoom ≥ 6). Les limites des pays viennent de
Natural Earth et sont hébergées avec le projet. Le fond de rues OpenStreetMap est
facultatif et nécessite une connexion réseau. La carte conserve son fond local
si les tuiles distantes sont indisponibles.

## Connexions implémentées

| Source         | Configuration                                                                   | Couverture chargée                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| France Travail | `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET`                    | 150 offres par page, puis bouton « Charger plus » ; mot-clé et commune + rayon de 30 km quand une ville française connue est choisie |
| LinkedIn       | `LINKEDIN_JOBS_FEED_URL` et éventuellement `LINKEDIN_JOBS_FEED_TOKEN`           | Jusqu’à 500 offres d’un flux JSON autorisé, au format décrit plus bas                                                                |
| HelloWork      | `HELLOWORK_JOBS_FEED_URL` et éventuellement `HELLOWORK_JOBS_FEED_TOKEN`         | Jusqu’à 500 offres d’un flux JSON autorisé, au format décrit plus bas                                                                |
| Arbeitnow      | Aucune clé                                                                      | Première page du flux public, principalement en Allemagne                                                                            |
| Greenhouse     | `GREENHOUSE_BOARDS` : identifiants de sites carrières, séparés par des virgules | Jusqu’à 5 sites configurés, 500 offres maximum par site                                                                              |
| Lever          | `LEVER_BOARDS` : identifiants de sites carrières, séparés par des virgules      | Jusqu’à 5 sites configurés, 500 offres maximum par site                                                                              |

Ces connecteurs ne donnent pas accès à tous les employeurs ni à tous les job boards.
Les connecteurs LinkedIn et HelloWork sont des lecteurs de **flux autorisés**, pas
des accès inventés à des API publiques de recherche. Sans flux obtenu auprès d’un
partenaire autorisé, ils affichent « Connexion à configurer ». Un compte OAuth
LinkedIn standard ne donne pas automatiquement accès à son catalogue d’offres.
Indeed et Glassdoor ne sont pas connectés. Aucun scraping ni candidature automatique.

L’ajout de ces lecteurs ne permet pas de contourner les conditions d’accès ni de
garantir un catalogue complet. Les offres reçues, la couverture et les quotas
dépendent du fournisseur et du contrat.

### France Travail sur Vercel

1. Créer son compte développeur sur https://francetravail.io/ et demander l’accès
   au produit **Offres d’emploi** pour une application Crétoria. Suivre les étapes
   d’activation du portail ; une demande de droits peut nécessiter une validation.
2. Une fois cet accès accordé, récupérer les identifiants OAuth de l’application.
3. Dans le projet Vercel → Settings → Environment Variables, ajouter
   `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET` pour les environnements
   souhaités (Production et/ou Preview). Ne pas les préfixer par `VITE_`.
4. Redéployer une version autorisée par Vercel pour prendre en compte les variables.
5. Ouvrir Carte → Sources d’offres et vérifier le nombre réellement chargé.

Le fichier `.env.example` liste les noms de variables et ne contient aucun secret.
En développement, copier ce fichier dans `.env.local` (ignoré par Git) et renseigner
les valeurs localement. Ne jamais partager ce fichier ni les clés dans le chat.

Ne pas coller les secrets dans le chat ou dans Git. Les variables restent sur le
serveur. Elles ne servent qu’à lire les annonces via OAuth `client_credentials`,
avec les scopes `api_offresdemploiv2 o2dsoffre`. Le jeton est conservé en mémoire
jusqu’à son expiration. Une connexion configurée peut encore être refusée par le
fournisseur si les droits ou les quotas sont insuffisants.

Les variables Greenhouse/Lever contiennent les identifiants publics des sites
carrières à consulter, pas des mots de passe. Exemples d’URL documentées :
`boards-api.greenhouse.io/v1/boards/{identifiant}/jobs` et
`api.lever.co/v0/postings/{identifiant}?mode=json`.

### Flux LinkedIn et HelloWork

Il faut d’abord obtenir un droit de diffusion et un flux de données. Aucune URL
de recherche web LinkedIn ou HelloWork ne peut être utilisée comme flux JSON.
Les endpoints de ces plateformes n’étant pas fournis dans la session, le lecteur
attend un **format normalisé** à produire depuis le contrat d’API du partenaire :

```json
{
  "offers": [
    {
      "id": "identifiant-du-fournisseur",
      "title": "Titre du poste",
      "company": "Nom de l’employeur",
      "location": "Paris",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "url": "https://www.linkedin.com/jobs/view/identifiant",
      "contract": "CDI",
      "salary": "40 000–50 000 € brut/an"
    }
  ]
}
```

L’exemple est uniquement documentaire et n’est jamais chargé dans le site. Pour
HelloWork, `url` doit pointer vers une annonce sur `hellowork.com`. Pour LinkedIn,
elle doit pointer vers `linkedin.com`. Les sous-domaines sont acceptés ; les autres
domaines et protocoles sont refusés. Le titre, l’identifiant et le lien sont
nécessaires. Les coordonnées sont facultatives : sans elles, une ville connue est
utilisée avec un avertissement de position approximative, sinon l’offre reste
dans la liste sans marqueur inventé.

Configurer l’URL HTTPS du flux dans `LINKEDIN_JOBS_FEED_URL` ou
`HELLOWORK_JOBS_FEED_URL`. Si le flux exige un jeton Bearer, configurer la variable
`…_JOBS_FEED_TOKEN` correspondante. Les URLs de flux et les jetons restent côté
serveur et ne sont jamais inclus dans la réponse publique. Le lecteur accepte
jusqu’à 500 offres par réponse ; il ne prétend pas synchroniser tout le catalogue.

Les liens partenaires présents dans une réponse France Travail sont également
conservés, y compris HelloWork si ce partenaire est effectivement fourni. L’offre
reste attribuée au flux France Travail qui l’a transmise. Cela ne constitue pas
un accès général au catalogue du partenaire.

## Données affichées

`GET /api/job-map?q=...&commune=75056&offset=0` agrège les sources sur le serveur. Les requêtes
distantes expirent après 8 secondes. Les réponses sont mises en cache 5 minutes ;
les pannes d’une source n’empêchent pas les autres de répondre. Le cache conserve
au plus 100 recherches par processus. Une source non configurée ou inaccessible
est indiquée explicitement. Aucune annonce fictive n’est injectée en production.

La réponse inclut `nextFranceTravailOffset`, `franceTravailTotal` (si le fournisseur
le communique) et `franceTravailLimitReached`. Les pages suivantes utilisent un
offset multiple de 150, de 150 à 3000 inclus, et ne rechargent pas les autres
fournisseurs. La carte fusionne les pages en conservant les annonces déjà reçues.
Elle s’arrête à la fin des résultats ou à la limite de recherche de 3 150 offres ;
dans ce dernier cas, elle invite à préciser le métier ou la ville. Il ne s’agit
pas d’une synchronisation complète nationale de France Travail.

Les doublons sont supprimés par identifiant et URL canonique, en ignorant les
paramètres de suivi usuels. Le lien sortant original reste intact. Des postes
différents ne sont pas fusionnés uniquement parce que leur titre se ressemble.

France Travail fournit les coordonnées des lieux de travail. Les autres sources
ne sont placées sur la carte que si leur ville correspond à une entrée connue du
référentiel local ; cette position approximative au centre de la ville est signalée.
Les lieux ambigus/non reconnus et les annonces à distance sans ville restent
accessibles dans la liste en décochant « Uniquement dans la zone visible ».
Les chiffres concernent les offres chargées et ne constituent pas des totaux du
marché. Le regroupement visuel des marqueurs change avec le zoom. Des liens source
strictement HTTPS sont proposés, sans rendu HTML des descriptions des fournisseurs.

« Rechercher dans cette zone » utilise le centre de la carte pour reconnaître une
ville française du référentiel (à environ 30 km) et interroger France Travail. Dans
les autres cas, il recharge les offres et filtre le lot reçu avec l’emprise visible.
Les résultats peuvent donc être incomplets ; il ne s’agit pas d’un inventaire mondial.

## Limites de validation de cet environnement

Aucune clé France Travail, aucun flux LinkedIn/HelloWork autorisé ni liste de sites
Greenhouse/Lever n’est fourni dans cette session. L’utilisateur a confirmé ne pas
encore disposer d’accès développeur France Travail. Les appels aux services externes
peuvent également être bloqués par le réseau de l’environnement. Les connecteurs
sont testés avec des réponses API de test, sans publier ces données comme des offres
réelles. L’activation en production doit être vérifiée après configuration Vercel.

Les changements de salaire dans Autopilote sont des critères locaux persistants,
exprimés en euros brut/an. L’Autopilote conserve son fonctionnement de configuration
et ne lance aucune recherche distante ou candidature automatique.

## Vérifications de cette version

- 40 tests unitaires réussis, dont l’authentification France Travail simulée, la
  pagination et son plafond, les liens partenaires, les flux autorisés, la
  confidentialité des jetons, le dédoublonnage et les coordonnées.
- TypeScript, build Vercel et lint des fichiers modifiés validés.
- Vérifications du nouveau chargement dans le navigateur : pages fusionnées,
  reprise après panne, nouvelle recherche, liens partenaires et six sources,
  en français/anglais, sur ordinateur/mobile et dans le thème sombre. L’absence
  de clés est vérifiée comme une absence de connexion, pas comme un succès.
- Vérifications navigateur : globe/plan, déplacement au clic gauche, zoom,
  marqueurs, liens source, salaire persistant, français/anglais, clair/sombre,
  mobile et accessibilité Axe. Les offres de test sont injectées uniquement par
  le navigateur de vérification et ne font pas partie du site livré.
  Version carte, salaires et nouvel accueil à publier.
