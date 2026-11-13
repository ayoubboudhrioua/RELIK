# RELIK architecture

How the parts of the prototype fit together. Read this before changing the code.

## Run it

```bash
npm install
npm run dev:all  # site on http://localhost:5173 + API on http://localhost:3001  (/styleguide shows every component)
npm run test     # Vitest: Lab model, services against a real API, API routes, archive search, data checks
npm run test:e2e # Playwright: journeys A, B and C plus hardening checks (Chrome, phone, Firefox, Safari)
npm run build    # production build in dist/
npm start        # builds, then one server on http://localhost:3001: the API and the site
```

## The server (`server/`)

| File                      | What lives there                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `index.js`                | Starts the API (`--port`, `--db`, `--fresh`, `--site` options)                                     |
| `app.js`                  | Builds the Express app: JSON body, routes under `/api`, the built site with `--site`, error handler |
| `routes/auth.js`          | `/api/auth`: register, login, logout, me, reset; `requireUser` middleware (Bearer token)           |
| `routes/collection.js`    | `/api/collection`: list, add, edit, delete, save or unsave an archive object                       |
| `routes/objects.js`       | `/api/objects`: the archive, read-only, filtered with `src/data/archiveQuery.js`                   |
| `db.js`                   | The JSON-file database (`server/data/db.json`, not in Git): `users`, `sessions`, `collections`     |
| `items.js`, `seed.js`     | Building and editing collection items; the archive data from `src/data/relik-seed-data.json`       |
| `passwords.js`, `demo.js` | scrypt password hashing; the demo account created at start-up                                      |

The server reuses `src/services/validation.js` and `src/data/archiveQuery.js`, so the browser and the server check forms and search the archive with the same code.

## Folders (`src`)

| Folder                  | What lives there                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                  | `App.jsx` (providers + routes), `Layout.jsx` (skip link, nav, footer, and `RouteMotion` next to each page)                                                                                                                                                                                                                                                                                                                                                       |
| `routes/`               | One folder per screen: `Home`, `Archive`, `Logbook`, `Lab`, `Collection`, `Auth`, `Credits`, `NotFound`, and the dev-only `Styleguide`                                                                                                                                                                                                                                                                                                                           |
| `components/`           | Reusable parts of the visual vocabulary: `Panel`, `SpecimenBay`, `DymoLabel`, `Screen`, `TransportKey`, `Switch`, `Fader`, `LedMeter`, `TapeCounter`, `Backdrop` (the animated glow behind dark rooms), `Nav`, `Footer`, `Field`, `Select`, `Dialog`, `Toast`, `ErrorSummary`, `Icon`                                                                                                                                                                            |
| `content/en.js`         | **Every piece of interface text.** Components never hard-code copy. A French file can mirror this shape                                                                                                                                                                                                                                                                                                                                                          |
| `data/`                 | `objects.js` reads `relik-seed-data.json` and adds alt text and periods; `credits.js` lists every photograph; `archiveQuery.js` searches, filters and sorts the Archive (settings kept in the address bar)                                                                                                                                                                                                                                                  |
| `lab/model.js`          | The Decision Lab maths as pure functions (no React), tested in `model.test.js`                                                                                                                                                                                                                                                                                                                                                                                   |
| `services/`             | Talks to the server: `api.js` (`request()`, the token, `ApiError`), `auth.js`, `collection.js`; plus `validation.js` (shared with the server) and `storage.js`                                                                                                                                                                                                                                                                                                                                                              |
| `motion/`               | Shared motion code. `gsap.js` registers the GSAP plugins once (import `gsap`, `ScrollTrigger`, `SplitText`, `useGSAP` from here). `SmoothScroll.jsx` is the one place Lenis meets GSAP (ticker, ScrollTrigger updates, refresh after fonts and images). `RouteMotion.jsx` + `reveals.js` set up each page's scroll reveals from data attributes. `backdrop.js` runs the backdrop parallax and tab pause. `useFontsReady.js` waits for fonts before text is split |
| `hooks/`                | `useAuth`, `useCollection`, `useCrtEffects` (React context), `useForm` (validation, error summary, loading), `useReducedMotion`, `useMediaQuery`, `usePageTitle`                                                                                                                                                                                                                                                                                                 |
| `e2e/`                  | Playwright journeys A, B and C                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `scripts/`              | Dev helpers for screenshots and quick checks, run with `npm run dev` going. Phase 8 motion checks: `story-check.mjs` (pinned story, route changes), `scroll-check.mjs` (reveals), `backdrop-shots.mjs`, `terminal-shots.mjs`, `phase8-shots.mjs`                                                                                                                                                                                                                 |
| `styles/`               | `tokens.css` (design tokens), `global.css` (base styles), `fonts.css` (self-hosted fonts)                                                                                                                                                                                                                                                                                                                                                                        |

Each component folder holds `Component.jsx` and `Component.module.css`. CSS Modules keep class names local; shared values come from the CSS variables in `tokens.css`.

## How data flows

```
src/data/relik-seed-data.json ──► data/objects.js ──► routes and components
content/en.js ─────────────────────────────────────► every visible string

route ──► hook (useAuth / useCollection) ──► service ──► api.js ──fetch /api──► server/routes ──► server/data/db.json
route ──► lab/model.js (pure function) ──► LedMeter, ranks, fit words
```

- **Facts** about objects only come from the seed JSON. Fictional content (conditions, repair logs, memories, the demo collection) is flagged and shown with a "Sample" label.
- **Services call the API** and throw an `ApiError` (also exported as `AuthError`) with a `code` and `fields`. The codes are keys of `en.auth.errors` / `en.collection.errors`, so `useForm` shows the right sentence.
- **localStorage keys:** `relik:token` (session token), `relik:session` (the signed-in `{ name, email }`, shown before the server answers), `relik:saved` (objects saved while signed out), `relik:crt`, `relik:booted`.

## Providers (outside in)

`CrtEffectsProvider` → `AuthProvider` → `CollectionProvider` → `ToastProvider` → `BrowserRouter` → `SmoothScroll` → `Layout` → page.

Every page except Home is loaded on first visit (`lazy()` in `App.jsx`); `Layout` shows the nav and footer while a page's code loads.

## Motion

Every animation checks `useReducedMotion()` first; with reduced motion the page is complete and still. Only `transform`, `opacity` and `filter` are animated.

- **Page reveals** need no code in the page: mark the elements and `RouteMotion` (rendered by `Layout`, keyed by the path) does the rest, once, and undoes it all when the page changes.
  - every `h2` with plain text rises line by line from behind a mask;
  - `data-stagger` on a list: its items arrive in small batches (the Archive gallery, the Collection rack). A filter never re-animates them;
  - `data-tick` on a list or `<dl>`: its rows tick in one by one (Logbook spec sheets);
  - `data-parallax` on a photo holder: the photo drifts slightly slower than the page.
    Anything already on the first screen is left alone.
- **Components with their own motion:** `HeroTerminal` (boot timeline), `WalkmanStory` + `useStoryMotion` (pinned story), `VuMeters` (scroll speed), `TapeCounter` (rolls in when seen), `Backdrop`.
- Use `useGSAP()` with a scope ref for anything new, so tweens and ScrollTriggers die with the component.

## Forms

All forms use `useForm` (hooks) with a validator from `services/validation.js`. Errors show under a field after it loses focus, and after a failed submit an `ErrorSummary` lists every problem and takes focus. Error text comes from `en.auth.errors` or `en.collection.errors`.

## Rules that keep it accessible

- Every control is a real `button`, `a`, `input` or `label`. `Switch` is a checkbox or radio; `Fader` is `input type="range"`.
- Meaning never relies on colour: meters show a fit word and rank, errors start with "Error".
- `useReducedMotion()` is checked by every animation. With reduced motion, Lenis is switched off and the page scrolls normally.
- CRT scanlines and glow only appear when `<html data-crt="on">`, set by the footer switch.

## Checks for translators and long text

Open any page with `?pseudo` in development (for example `/lab?pseudo`) to make every string about 30% longer, roughly the length of French. Layouts must still hold. Counts use `countText()` in `content/format.js`, which picks the singular or plural form with `Intl.PluralRules`.

## Third-party code

`components/ReactBits/ScrambledText/` is vendored from React Bits (MIT + Commons Clause) and left unchanged; RELIK uses it only through `components/DecodeText/`.

## Design references

`PRODUCT.md` (who it is for), `DESIGN.md` (the visual system), `design-system/relik/MASTER.md` (exact values and contrast ratios).
