# RELIK

> Technology never truly disappears.

**Projet Web, Objectif 3 : développement et intégration des fonctionnalités principales**
Groupe 2 · Ayoub Boudhrioua, Mohamed Amine Elghzel · Encadrante : Dr. Maroua Nouioua
SUP'COM, Université de Carthage · Année universitaire 2026/2027

RELIK est un musée numérique interactif consacré aux appareils électroniques et aux supports physiques
oubliés : baladeurs cassette, premiers ordinateurs, consoles, appareils photo, Minitel, VHS, disquettes.
Le site réunit deux idées :

- **Une archive** : chaque objet possède une fiche documentée, son _Logbook_ (photo, période, fabricant,
  histoire, état).
- **Un laboratoire de décision (Decision Lab)** : une simulation pédagogique de l'avenir possible d'un
  appareil ancien : réparer, réemployer, donner, conserver, récupérer des pièces ou recycler.

Les visiteurs peuvent aussi créer un compte et tenir leur propre collection d'objets.

> L'interface est en anglais. Tous les textes sont réunis dans `src/content/en.js`, ce qui prépare une
> traduction française (`fr.js`) sans toucher aux composants.

---

## 1. Choix technologiques

| Couche | Technologie | Pourquoi ce choix |
| --- | --- | --- |
| Interface | **React 19** | Le site est fait de pièces réutilisées partout (panneaux, touches, dialogues, champs). Les composants React les écrivent une seule fois. Les _hooks_ et le _Context_ partagent la session et la collection entre les pages sans bibliothèque supplémentaire. |
| Navigation | **React Router 7** | Une application monopage avec 10 routes. Les réglages de l'archive (recherche, filtres, tri) sont gardés dans l'adresse : une recherche peut être partagée et le bouton Retour fonctionne. Les pages secondaires sont chargées à la demande. |
| Outil de build | **Vite 8** | Serveur de développement instantané, build de production optimisé, et un _proxy_ qui transmet `/api` au serveur Node. |
| Style | **CSS Modules** + variables CSS | Les classes restent locales à chaque composant. La charte graphique de l'Objectif 2 (couleurs, typographies, espacements) est centralisée dans `src/styles/tokens.css`. |
| Animation | **GSAP** + **Lenis** | Séquence de démarrage, histoire défilante du Walkman, apparitions au défilement. Tout est désactivé quand le système demande moins d'animations (`prefers-reduced-motion`). |
| Backend | **Node.js** + **Express 5** | Le même langage (JavaScript) côté navigateur et côté serveur. Express suffit pour une petite API REST et se lit facilement. Le serveur réutilise le code de validation (`validation.js`) et de recherche (`archiveQuery.js`) du frontend. |
| Données | Fichier **JSON** (`server/data/db.json`) | Suffisant pour un prototype : aucune base de données à installer. Le module `server/db.js` pourrait être remplacé par SQLite ou MongoDB sans changer les routes. |
| Tests | **Vitest** + **Playwright** | Tests unitaires et tests de l'API ; parcours complets dans Chrome, Firefox, Safari (WebKit) et sur mobile. |

**Pourquoi React plutôt qu'Angular ou Vue ?** Angular impose plus de structure (TypeScript, modules,
services injectés) qu'il n'en faut pour un projet de cette taille. Vue aurait convenu aussi ; React a
été retenu pour son écosystème (React Router, `@gsap/react`, Vitest) et l'abondance de sa documentation.

## 2. Fonctionnalités développées

| Page | Adresse | Fonctionnalités |
| --- | --- | --- |
| Accueil | `/` | Mission du projet, séquence de démarrage façon écran cathodique, histoire du Walkman au défilement, accès direct à l'Archive et au Lab |
| Archive | `/archive` | Recherche par mot (insensible aux accents), filtres par catégorie et par période avec compteurs, tri (année, nom), vue galerie ou index, aperçu rapide d'un objet, réglages gardés dans l'adresse |
| Fiche d'objet (Logbook) | `/objects/:id` | Photo, période, fabricant, caractéristiques, histoire, état ; bouton « Save to collection » |
| Decision Lab | `/lab` | Choix d'un appareil, curseurs pour les critères (souris ou flèches du clavier), priorité pratique ou culturelle, classement des six destinations possibles avec explication, remise à zéro |
| Ma collection | `/collection` | Réservée aux comptes connectés. Ajout, modification et suppression de Logbooks avec validation, recherche, filtre par statut, compteurs, frise chronologique |
| Comptes | `/register`, `/signin`, `/reset` | Inscription, connexion, compte de démonstration, déconnexion, demande de réinitialisation du mot de passe |
| Crédits | `/credits` | Auteur et licence de chaque photographie |
| Page introuvable | toute autre adresse | Page 404 dans le style du site |

**Sur tout le site :**

- **Formulaires dynamiques** : erreurs sous chaque champ, résumé des erreurs qui prend le focus, état
  « chargement » pendant l'appel au serveur, erreurs renvoyées par le serveur affichées au bon endroit.
- **Données gérées par une API REST** : comptes, sessions et collections sont gardés sur le serveur.
  Un objet enregistré sans être connecté attend dans le navigateur et rejoint la collection à la connexion.
- **Gestion d'état** : `AuthProvider` et `CollectionProvider` (Context + hooks) partagent la session et
  la collection avec toutes les pages.
- **Responsive** : vérifié de 390 px (téléphone) à 1440 px (ordinateur) ; filtres en panneau sur mobile.
- **Accessibilité** : balises sémantiques, lien d'évitement, navigation au clavier, contrastes vérifiés,
  le sens ne repose jamais sur la couleur seule.
- **Notifications** (_toasts_) après chaque action, et un interrupteur pour les effets d'écran cathodique.

## 3. Lancement du projet

**Prérequis :** [Node.js](https://nodejs.org/) 20.19 ou plus récent (22 LTS conseillé) et Git.

```bash
git clone https://github.com/ayoubboudhrioua/RELIK.git
cd RELIK
npm install
npm run dev:all
```

- Site : <http://localhost:5173>
- API : <http://localhost:3001/api/health> doit répondre `{"ok":true}`

`npm run dev:all` lance ensemble le site (Vite) et l'API (Express). On peut aussi les lancer dans deux
terminaux séparés : `npm run dev` et `npm run server`.

**Compte de démonstration**, avec une collection d'exemple :
`demo@relik.example` / `relik-demo` (ou le bouton « Use the demo account » sur la page de connexion).

**Version de production**, sur un seul serveur :

```bash
npm start          # construit le site puis sert site + API sur http://localhost:3001
```

En développement, utiliser le port **5173** : le port 3001 ne sert alors que l'API.

### Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev:all` | Site + API en développement |
| `npm run dev` | Site seul (Vite, port 5173) |
| `npm run server` | API seule (Express, port 3001), redémarre à chaque modification |
| `npm run build` | Build de production dans `dist/` |
| `npm start` | Construit le site, puis sert l'API et le site sur le port 3001 |
| `npm run test` | Tests unitaires et tests de l'API (Vitest) |
| `npm run test:e2e` | Parcours dans le navigateur (Playwright) |

Pour repartir d'une base vide, supprimer `server/data/db.json` (le fichier est recréé au démarrage, avec
le compte de démonstration).

## 4. API REST

Toutes les adresses commencent par `/api`. Les routes marquées 🔒 demandent l'en-tête
`Authorization: Bearer <token>` reçu à la connexion. Les erreurs ont la forme
`{ "error": "<code>", "fields": { "<champ>": "<code d'erreur>" } }`.

| Méthode | Adresse | Corps / paramètres | Réponse |
| --- | --- | --- | --- |
| GET | `/api/health` | | `200 { ok: true }` |
| POST | `/api/auth/register` | `{ name, email, password }` | `201 { user, token }` · `400` · `409` email déjà pris |
| POST | `/api/auth/login` | `{ email, password }` | `200 { user, token }` · `400` · `401` |
| POST | `/api/auth/logout` 🔒 | | `204` |
| GET | `/api/auth/me` 🔒 | | `200 { user }` · `401` |
| POST | `/api/auth/reset` | `{ email }` | `202` (même réponse que le compte existe ou non ; aucun email envoyé) |
| GET | `/api/objects` | `?q=&cat=&period=&sort=` | `200 [objets]` |
| GET | `/api/objects/:id` | | `200 objet` · `404` |
| GET | `/api/collection` 🔒 | | `200 [éléments]` |
| POST | `/api/collection` 🔒 | `{ name, maker, year, category, status, condition, story }` ou `{ objectId }` | `201 élément` · `400` |
| PATCH | `/api/collection/:id` 🔒 | champs modifiés | `200 élément` · `400` · `404` |
| DELETE | `/api/collection/:id` 🔒 | | `204` · `404` |
| DELETE | `/api/collection/objects/:objectId` 🔒 | | `204` |

Les mots de passe sont hachés avec _scrypt_ (module `node:crypto`) et ne sont jamais stockés en clair.

Exemple :

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@relik.example","password":"relik-demo"}'
```

## 5. Tests

```bash
npm run test                                   # 63 tests : modèle du Lab, services, API, recherche, données
npx playwright install chromium firefox webkit # une seule fois
npm run test:e2e                               # parcours A, B, C + cas limites
```

Les tests navigateur démarrent eux-mêmes l'API (avec une base vide) et le site. Ils couvrent :

- **A** : Accueil → Archive → filtre → fiche d'objet → enregistrer → Ma collection (compte démo)
- **B** : Accueil → Decision Lab → appareil → critères au clavier → résultats → remise à zéro
- **C** : inscription → ajouter un Logbook (avec erreurs) → le modifier → le supprimer
- un nom et une histoire très longs, et le parcours principal au clavier seul

Ils sont configurés pour Chrome bureau, Chrome mobile (Pixel 7, 390 px), Firefox et Safari (WebKit).



## 6. Structure du projet

```
server/            API Express
  index.js         démarrage (options --port, --db, --fresh, --site)
  app.js           application Express : routes /api, site construit, erreurs
  routes/          auth.js, collection.js, objects.js
  db.js            base JSON (server/data/db.json, hors Git)
  items.js, seed.js, passwords.js, demo.js
src/
  app/             providers, routes, mise en page
  routes/          un dossier par page
  components/      composants réutilisables
  content/         tous les textes de l'interface (en.js)
  data/            données de démonstration, crédits, recherche de l'archive
  lab/             modèle du Decision Lab (testé)
  services/        appels à l'API (api.js, auth.js, collection.js), validation
  hooks/           hooks React partagés (useAuth, useCollection, useForm…)
  styles/          variables de la charte graphique et styles globaux
e2e/               tests Playwright
docs/              ARCHITECTURE.md, DESIGN.md, PRODUCT.md
public/            polices, images, favicon
```

Le fonctionnement détaillé est décrit dans [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) et
[`GETTING_STARTED.md`](GETTING_STARTED.md).

## 7. Organisation de l'équipe

- Une branche par fonctionnalité (`feat/...`, `docs/...`, `test/...`), fusionnée par _pull request_ après
  relecture par l'autre membre.
- Suivi des tâches : tableau GitHub Projects du dépôt (onglet **Projects**).

## 8. Limites du prototype

- Les données de l'archive sont des données de démonstration. Les éléments fictifs (états, histoires de
  la collection d'exemple) portent l'étiquette **Sample**.
- Les résultats du Decision Lab sont illustratifs : ce n'est ni une expertise de réparation ni une
  estimation de valeur.
- La sécurité reste celle d'un projet de cours : pas de HTTPS en local, jeton de session simple, base
  JSON. Ne pas utiliser un vrai mot de passe.
- La réinitialisation du mot de passe est simulée : aucun email n'est envoyé.

## 9. Évolutions possibles

Traduction française de l'interface (`src/content/fr.js`), annulation après suppression d'un objet,
Logbooks complets pour plus d'objets, ajout de photos par les utilisateurs, QR codes vers les fiches,
base de données SQLite ou MongoDB, déploiement en ligne.

## Crédits

Les photographies proviennent de Wikimedia Commons ; auteurs et licences sont listés sur la page
`/credits` du site. Le composant `ScrambledText` vient de React Bits (licence MIT + Commons Clause).
