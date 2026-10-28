# Carte et sources d’offres

La page `/app/map` utilise MapLibre GL 5.24.0. La projection passe progressivement
du globe (zoom ≤ 2) au plan Mercator (zoom ≥ 6). Les limites des pays viennent de
Natural Earth et sont hébergées avec le projet. Le fond de rues OpenStreetMap est
facultatif et nécessite une connexion réseau. La carte conserve son fond local
si les tuiles distantes sont indisponibles.

## Connexions implémentées

| Source         | Configuration                                                                   | Couverture chargée                                                                                                              |
| -------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| France Travail | `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET`                    | Les 150 premières offres renvoyées par l’API ; mot-clé et commune + rayon de 30 km quand une ville française connue est choisie |
| Arbeitnow      | Aucune clé                                                                      | Première page du flux public, principalement en Allemagne                                                                       |
| Greenhouse     | `GREENHOUSE_BOARDS` : identifiants de sites carrières, séparés par des virgules | Jusqu’à 5 sites configurés, 500 offres maximum par site                                                                         |
| Lever          | `LEVER_BOARDS` : identifiants de sites carrières, séparés par des virgules      | Jusqu’à 5 sites configurés, 500 offres maximum par site                                                                         |

Ces connecteurs ne donnent pas accès à tous les employeurs ni à tous les job boards.
LinkedIn, Indeed, HelloWork et Glassdoor ne sont pas connectés : ils demandent un
accès autorisé à leurs données. Aucun scraping ni candidature automatique.

### France Travail sur Vercel

1. Obtenir un accès au produit **Offres d’emploi** sur
   https://francetravail.io/produits/offres-emploi et ses identifiants OAuth.
2. Dans le projet Vercel → Settings → Environment Variables, ajouter
   `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET` pour les environnements
   souhaités (Production et/ou Preview). Ne pas les préfixer par `VITE_`.
3. Redéployer une version autorisée par Vercel pour prendre en compte les variables.
4. Ouvrir Carte → Sources d’offres et vérifier le nombre réellement chargé.

Ne pas coller les secrets dans le chat ou dans Git. Les variables restent sur le
serveur. Elles ne servent qu’à lire les annonces via OAuth `client_credentials`,
avec les scopes `api_offresdemploiv2 o2dsoffre`. Le jeton est conservé en mémoire
jusqu’à son expiration. Une connexion configurée peut encore être refusée par le
fournisseur si les droits ou les quotas sont insuffisants.

Les variables Greenhouse/Lever contiennent les identifiants publics des sites
carrières à consulter, pas des mots de passe. Exemples d’URL documentées :
`boards-api.greenhouse.io/v1/boards/{identifiant}/jobs` et
`api.lever.co/v0/postings/{identifiant}?mode=json`.

## Données affichées

`GET /api/job-map?q=...&commune=75056` agrège les sources sur le serveur. Les requêtes
distantes expirent après 8 secondes. Les réponses sont mises en cache 5 minutes ;
les pannes d’une source n’empêchent pas les autres de répondre. Le cache conserve
au plus 100 recherches par processus. Une source non configurée ou inaccessible
est indiquée explicitement. Aucune annonce fictive n’est injectée en production.

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

Aucune clé France Travail ni liste de sites Greenhouse/Lever n’est fournie dans
cette session. Les appels aux services externes peuvent également être bloqués par
le réseau de l’environnement. Les connecteurs sont testés avec des réponses API
de test, sans publier ces données comme des offres réelles.

Les changements de salaire dans Autopilote sont des critères locaux persistants,
exprimés en euros brut/an. L’Autopilote conserve son fonctionnement de configuration
et ne lance aucune recherche distante ou candidature automatique.

## Vérifications de cette version

- 35 tests unitaires réussis, dont l’authentification France Travail simulée, les
  pannes isolées, les coordonnées, les bornes de salaire et l’antiméridien.
- TypeScript, build Vercel et lint validés (six avertissements UI préexistants).
- Vérifications navigateur : globe/plan, déplacement au clic gauche, zoom,
  marqueurs, liens source, salaire persistant, français/anglais, clair/sombre,
  mobile et accessibilité Axe. Les offres de test sont injectées uniquement par
  le navigateur de vérification et ne font pas partie du site livré.
