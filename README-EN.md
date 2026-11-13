# RELIK

> Technology never truly disappears.

**Web Project, Objective 3: development and integration of the main features**
Group 2 · Ayoub Boudhrioua, Mohamed Amine Elghzel · Supervisor: Dr. Maroua Nouioua
SUP'COM, University of Carthage · Academic year 2026/2027

RELIK is an interactive digital museum dedicated to forgotten electronic devices and physical media:
cassette players, early computers, consoles, cameras, Minitel, VHS, floppy disks.
The site brings together two ideas:

- **An archive**: every object has a documented record, its _Logbook_ (photo, period, maker,
  history, condition).
- **A Decision Lab**: an educational simulation of the possible future of an old device: repair,
  reuse, donate, keep, salvage parts, or recycle.

Visitors can also create an account and keep their own collection of objects.

> The interface is in English. All texts are gathered in `src/content/en.js`, which prepares a
> French translation (`fr.js`) without touching the components.

---

## 1. Technology choices

| Layer | Technology | Why this choice |
| --- | --- | --- |
| Interface | **React 19** | The site is made of pieces reused everywhere (panels, keys, dialogs, fields). React components let us write them once. _Hooks_ and _Context_ share the session and the collection across pages without any extra library. |
| Navigation | **React Router 7** | A single-page application with 10 routes. The archive settings (search, filters, sort) are kept in the URL: a search can be shared and the Back button works. Secondary pages are loaded on demand. |
| Build tool | **Vite 8** | Instant development server, optimized production build, and a _proxy_ that forwards `/api` to the Node server. |
| Styling | **CSS Modules** + CSS variables | Class names stay local to each component. The visual identity from Objective 2 (colors, typefaces, spacing) is centralized in `src/styles/tokens.css`. |
| Animation | **GSAP** + **Lenis** | Boot sequence, scrolling Walkman story, reveal-on-scroll effects. Everything is disabled when the system asks for reduced motion (`prefers-reduced-motion`). |
| Backend | **Node.js** + **Express 5** | The same language (JavaScript) in the browser and on the server. Express is enough for a small REST API and is easy to read. The server reuses the frontend's validation (`validation.js`) and search (`archiveQuery.js`) code. |
| Data | **JSON** file (`server/data/db.json`) | Sufficient for a prototype: no database to install. The `server/db.js` module could be replaced by SQLite or MongoDB without changing the routes. |
| Tests | **Vitest** + **Playwright** | Unit tests and API tests; full user journeys in Chrome, Firefox, Safari (WebKit) and on mobile. |

**Why React rather than Angular or Vue?** Angular imposes more structure (TypeScript, modules,
injected services) than a project of this size needs. Vue would have worked too; React was chosen
for its ecosystem (React Router, `@gsap/react`, Vitest) and the abundance of its documentation.

## 2. Features developed

| Page | URL | Features |
| --- | --- | --- |
| Home | `/` | Project mission, CRT-screen-style boot sequence, scrolling Walkman history, direct access to the Archive and the Lab |
| Archive | `/archive` | Keyword search (accent-insensitive), filters by category and period with counts, sorting (year, name), gallery or index view, quick preview of an object, settings kept in the URL |
| Object record (Logbook) | `/objects/:id` | Photo, period, maker, specifications, history, condition; "Save to collection" button |
| Decision Lab | `/lab` | Device selection, sliders for the criteria (mouse or keyboard arrows), practical or cultural priority, ranking of the six possible destinations with explanation, reset |
| My collection | `/collection` | Reserved for signed-in accounts. Add, edit and delete Logbooks with validation, search, status filter, counters, timeline |
| Accounts | `/register`, `/signin`, `/reset` | Sign-up, sign-in, demo account, sign-out, password reset request |
| Credits | `/credits` | Author and license of each photograph |
| Page not found | any other URL | 404 page in the site's style |

**Across the whole site:**

- **Dynamic forms**: errors under each field, an error summary that receives focus, a "loading"
  state during the server call, server-returned errors displayed in the right place.
- **Data managed by a REST API**: accounts, sessions and collections are stored on the server.
  An object saved while not signed in waits in the browser and joins the collection on sign-in.
- **State management**: `AuthProvider` and `CollectionProvider` (Context + hooks) share the session
  and the collection with all pages.
- **Responsive**: checked from 390 px (phone) to 1440 px (desktop); filters in a panel on mobile.
- **Accessibility**: semantic tags, skip link, keyboard navigation, verified contrast, meaning never
  relies on color alone.
- **Notifications** (_toasts_) after every action, and a switch for the CRT-screen effects.

## 3. Running the project

**Prerequisites:** [Node.js](https://nodejs.org/) 20.19 or newer (22 LTS recommended) and Git.

```bash
git clone https://github.com/ayoubboudhrioua/RELIK.git
cd RELIK
npm install
npm run dev:all
```

- Site: <http://localhost:5173>
- API: <http://localhost:3001/api/health> should respond `{"ok":true}`

`npm run dev:all` launches the site (Vite) and the API (Express) together. You can also launch them in
two separate terminals: `npm run dev` and `npm run server`.

**Demo account**, with a sample collection:
`demo@relik.example` / `relik-demo` (or the "Use the demo account" button on the sign-in page).

**Production version**, on a single server:

```bash
npm start          # builds the site then serves site + API on http://localhost:3001
```

In development, use port **5173**: port 3001 then only serves the API.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev:all` | Site + API in development |
| `npm run dev` | Site only (Vite, port 5173) |
| `npm run server` | API only (Express, port 3001), restarts on every change |
| `npm run build` | Production build into `dist/` |
| `npm start` | Builds the site, then serves the API and the site on port 3001 |
| `npm run test` | Unit tests and API tests (Vitest) |
| `npm run test:e2e` | Browser journeys (Playwright) |

To start again from an empty database, delete `server/data/db.json` (the file is recreated on startup,
with the demo account).

## 4. REST API

All addresses start with `/api`. Routes marked 🔒 require the header
`Authorization: Bearer <token>` received at sign-in. Errors have the form
`{ "error": "<code>", "fields": { "<field>": "<error code>" } }`.

| Method | URL | Body / parameters | Response |
| --- | --- | --- | --- |
| GET | `/api/health` | | `200 { ok: true }` |
| POST | `/api/auth/register` | `{ name, email, password }` | `201 { user, token }` · `400` · `409` email already taken |
| POST | `/api/auth/login` | `{ email, password }` | `200 { user, token }` · `400` · `401` |
| POST | `/api/auth/logout` 🔒 | | `204` |
| GET | `/api/auth/me` 🔒 | | `200 { user }` · `401` |
| POST | `/api/auth/reset` | `{ email }` | `202` (same response whether or not the account exists; no email is sent) |
| GET | `/api/objects` | `?q=&cat=&period=&sort=` | `200 [objects]` |
| GET | `/api/objects/:id` | | `200 object` · `404` |
| GET | `/api/collection` 🔒 | | `200 [items]` |
| POST | `/api/collection` 🔒 | `{ name, maker, year, category, status, condition, story }` or `{ objectId }` | `201 item` · `400` |
| PATCH | `/api/collection/:id` 🔒 | modified fields | `200 item` · `400` · `404` |
| DELETE | `/api/collection/:id` 🔒 | | `204` · `404` |
| DELETE | `/api/collection/objects/:objectId` 🔒 | | `204` |

Passwords are hashed with _scrypt_ (`node:crypto` module) and are never stored in plain text.

Example:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@relik.example","password":"relik-demo"}'
```

## 5. Tests

```bash
npm run test                                   # 63 tests: Lab model, services, API, search, data
npx playwright install chromium firefox webkit # once only
npm run test:e2e                               # journeys A, B, C + edge cases
```

The browser tests start the API (with an empty database) and the site themselves. They cover:

- **A**: Home → Archive → filter → object record → save → My collection (demo account)
- **B**: Home → Decision Lab → device → criteria with the keyboard → results → reset
- **C**: sign-up → add a Logbook (with errors) → edit it → delete it
- a very long name and story, and the main journey using the keyboard alone

They are configured for desktop Chrome, mobile Chrome (Pixel 7, 390 px), Firefox and Safari (WebKit).



## 6. Project structure

```
server/            Express API
  index.js         startup (options --port, --db, --fresh, --site)
  app.js           Express app: /api routes, built site, errors
  routes/          auth.js, collection.js, objects.js
  db.js            JSON database (server/data/db.json, not in Git)
  items.js, seed.js, passwords.js, demo.js
src/
  app/             providers, routes, layout
  routes/          one folder per page
  components/      reusable components
  content/         all interface texts (en.js)
  data/            demo data, credits, archive search
  lab/             Decision Lab model (tested)
  services/        API calls (api.js, auth.js, collection.js), validation
  hooks/           shared React hooks (useAuth, useCollection, useForm…)
  styles/          design token variables and global styles
e2e/               Playwright tests
docs/              ARCHITECTURE.md, DESIGN.md, PRODUCT.md
public/            fonts, images, favicon
```

The detailed workings are described in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`GETTING_STARTED.md`](GETTING_STARTED.md).

## 7. Team organization

- One branch per feature (`feat/...`, `docs/...`, `test/...`), merged by _pull request_ after review
  by the other member.
- Task tracking: the repository's GitHub Projects board (**Projects** tab).

## 8. Limitations of the prototype

- The archive data is demo data. Fictional elements (conditions, stories in the sample collection)
  carry the **Sample** label.
- The Decision Lab results are illustrative: they are neither repair expertise nor a value estimate.
- Security remains that of a course project: no HTTPS locally, a simple session token, a JSON
  database. Do not use a real password.
- Password reset is simulated: no email is sent.

## 9. Possible future work

French translation of the interface (`src/content/fr.js`), undo after deleting an object, complete
Logbooks for more objects, user photo uploads, QR codes linking to records, SQLite or MongoDB
database, online deployment.

## Credits

Photographs come from Wikimedia Commons; authors and licenses are listed on the site's `/credits`
page. The `ScrambledText` component comes from React Bits (MIT license + Commons Clause).