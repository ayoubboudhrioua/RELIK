# Getting started with RELIK

How to get the prototype running on your machine, try it, and check that it still works before you push a change.

## What you need

- **Git**
- **Node.js 20.19 or newer** (22 LTS recommended). Check with:

  ```bash
  node --version
  ```

## 1. Get the code

```bash
git clone https://github.com/ayoubboudhrioua/relik.git
cd relik
npm install
npx playwright install chromium firefox webkit   # once; needed for the browser tests
```

## 2. Run it

```bash
npm run dev:all
```

This starts two things: the site (Vite) on <http://localhost:5173> and the API (Express) on
<http://localhost:3001>. Open the site. <http://localhost:3001/api/health> should answer `{"ok":true}`.
You can also run them in two terminals: `npm run dev` and `npm run server`.
In development, always use port 5173: port 3001 only answers the API.

If sign-in says the server is not answering, the API is not running.

## 3. Try the three journeys by hand

These are the paths the prototype must support end to end.

- **A. Find and save an object**
  Home → _Explore the Archive_ → turn on a category switch → open an object → _Save to collection_ → _My collection_ → _Sign in_.
- **B. Explore a device's futures**
  Home → _Enter the Decision Lab_ → pick a device → move the faders (mouse, or the arrow keys) → change the priority → _Reset_.
- **C. Keep your own Logbooks**
  _Sign in_ → _Create an account_, or _Use the demo account_ (`demo@relik.example` / `relik-demo`) → _Add a device_ → submit it empty to see the errors → fill it in → _Edit Logbook_ → _Remove_.

## 4. Useful extras

- **`/styleguide`** shows every component in every state. It exists only in development.
- **`?pseudo`** at the end of any address (for example `/lab?pseudo`) makes all text about 30% longer, roughly French length. Nothing should overflow or get cut off.
- **CRT effects**: the switch in the footer turns the scanlines and screen glow on and off.
- **Reduced motion**: in Chrome DevTools, open ⋮ → _More tools_ → _Rendering_ → _Emulate CSS prefers-reduced-motion: reduce_. The site should stay complete and calm, with no start-up sequence and no pinned story.
- **Resetting your data**: accounts and collections live in `server/data/db.json`. Stop the API, delete that file, and start it again (the demo account comes back). The browser only keeps the session token and objects saved while signed out (`relik:*` keys in DevTools → _Application_ → _Local Storage_).

## 5. Automated checks

Run these before every push.

```bash
npm run test        # unit tests: Lab model, services against a real API, API routes, archive search, data and credits
npm run test:e2e    # browser tests: journeys A, B, C, long input, keyboard-only (Chrome, phone, Firefox, Safari)
npm run build       # production build in dist/
npm start           # build, then serve the site and the API at http://localhost:3001
```

If a browser test fails, open the details with:

```bash
npx playwright show-report
```

## 6. Working together

One branch per change, then a pull request:

```bash
git checkout -b my-change
# ...edit...
npm run test && npm run test:e2e
git add -A
git commit -m "Short description of the change"
git push -u origin my-change
```

Then open a Pull Request on GitHub.

## Where things live

| What                                   | Where                                          |
| -------------------------------------- | ---------------------------------------------- |
| All interface text                     | `src/content/en.js`                            |
| Object facts (names, years, stories)   | `src/data/relik-seed-data.json`                |
| Photo credits                          | `src/data/credits.js` (shown on `/credits`)    |
| Decision Lab maths                     | `src/lab/model.js` (tested in `model.test.js`) |
| The API (accounts, collections)        | `server/` (tested in `server/server.test.js`)  |
| Design tokens (colours, type, spacing) | `src/styles/tokens.css`                        |
| How the parts fit together             | `docs/ARCHITECTURE.md`                         |

## House rules

- Never invent facts. Anything fictional (conditions, repair logs, memories) is labelled **Sample**.
- Put new text in `src/content/en.js`, never directly in a component.
- Every control must be a real `button`, `a`, `input` or `label`, reachable by keyboard, at least 44px.
- Never let meaning rely on colour alone: use words too.
- Check new screens at 1440px and 390px wide.
