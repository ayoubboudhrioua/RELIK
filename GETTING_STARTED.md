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
npx playwright install chromium   # once; needed for the browser tests
```

## 2. Run it

```bash
npm run dev
```

Open <http://localhost:5173>.

## 3. Try the three journeys by hand

These are the paths the prototype must support end to end.

- **A. Find and save an object**
  Home → *Explore the Archive* → turn on a category switch → open an object → *Save to collection* → *My collection* → *Sign in*.
- **B. Explore a device's futures**
  Home → *Enter the Decision Lab* → pick a device → move the faders (mouse, or the arrow keys) → change the priority → *Reset*.
- **C. Keep your own passports**
  *Sign in* → *Create an account*, or *Use the demo account* (`demo@relik.example` / `relik-demo`) → *Add a device* → submit it empty to see the errors → fill it in → *Edit passport* → *Remove*.

## 4. Useful extras

- **`/styleguide`** shows every component in every state. It exists only in development.
- **`?pseudo`** at the end of any address (for example `/lab?pseudo`) makes all text about 30% longer, roughly French length. Nothing should overflow or get cut off.
- **CRT effects**: the switch in the footer turns the scanlines and screen glow on and off.
- **Reduced motion**: in Chrome DevTools, open ⋮ → *More tools* → *Rendering* → *Emulate CSS prefers-reduced-motion: reduce*. The site should stay complete and calm, with no start-up sequence and no pinned story.
- **Resetting your data**: accounts and collections are simulated and stored in your browser. Open DevTools → *Application* → *Local Storage* and delete the `relik:*` keys.

## 5. Automated checks

Run these before every push.

```bash
npm run test        # unit tests: Lab model, services, archive search, data and credits
npm run test:e2e    # browser tests: journeys A, B, C, long input, keyboard-only (desktop and phone)
npm run build       # production build in dist/
npm run preview     # serve that build at http://localhost:4173
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

| What | Where |
|---|---|
| All interface text | `src/content/en.js` |
| Object facts (names, years, stories) | `src/data/relik-seed-data.json` |
| Photo credits | `src/data/credits.js` (shown on `/credits`) |
| Decision Lab maths | `src/lab/model.js` (tested in `model.test.js`) |
| Design tokens (colours, type, spacing) | `src/styles/tokens.css` |
| How the parts fit together | `docs/ARCHITECTURE.md` |

## House rules

- Never invent facts. Anything fictional (conditions, repair logs, memories) is labelled **Sample**.
- Put new text in `src/content/en.js`, never directly in a component.
- Every control must be a real `button`, `a`, `input` or `label`, reachable by keyboard, at least 44px.
- Never let meaning rely on colour alone: use words too.
- Check new screens at 1440px and 390px wide.
