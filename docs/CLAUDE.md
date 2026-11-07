# RELIK: project context for Claude Code

RELIK is an interactive digital museum of forgotten electronic devices and physical media. It covers old cameras, cassette players, retro consoles, early computers, MP3 players, CDs, VHS tapes and floppy disks. Tagline: **"Technology never truly disappears."**

The site joins two ideas:

- **An archive.** Each device gets a documented identity.
- **A Decision Lab.** It shows, for teaching purposes, what could happen to an old device: repair, reuse, donation, preservation, parts recovery or recycling.

Founding idea: _an object can lose its commercial value without losing its historical, practical, cultural or emotional value._

It is **not** a shop, a marketplace or a recycling-company dashboard.

## Project facts

- University web development course ("Projet Web"), SUP'COM, Université de Carthage, academic year 2026/2027.
- Groupe 2: Ayoub Boudhrioua and Mohamed Amine Elghzel. Supervisor: Dr. Maroua Nouioua.
- The team will maintain this code. Keep it readable for first-year engineering students:
  - small components and plain names, no clever abstractions;
  - a short `docs/ARCHITECTURE.md` explaining how the parts fit.
- Interface language: English first. Every string must be easy to translate to French later (see Content rules).

## Scope of the prototype

**In scope:**

- a responsive front-end with a home page;
- an archive with search and filters;
- object pages (Device Logbook) driven by sample data;
- a working Decision Lab simulation;
- a personal collection;
- **simulated** sign-up, sign-in and sign-out.

**Out of scope, do not build or pretend to have:**

- a real backend or database, real email, or photo upload storage;
- public contributions or moderation, QR codes, a verified Logbook history;
- an advanced allocation engine, a full Sankey diagram, or exportable reports.

Where a real service would exist, use a small mock module with the same interface (for example `src/services/auth.js` backed by `localStorage`), and label the UI honestly ("Simulated sign-in", "Sample data").

## Users

1. **Collectors and enthusiasts.** They want to catalogue objects, keep anecdotes and browse records.
2. **Clubs, associations and makerspaces.** They have a small inventory and want to compare reuse or preservation options.
3. **Families and non-specialists.** They found an old device and want to know what it is and what to do before throwing it away.
4. **Students, teachers and the curious.** They want to explore the history of technology.

UI consequences:

- simple vocabulary, category navigation and a visible search;
- structured records, and technical terms explained;
- nothing that relies on colour alone.

## Routes and screens

| Route                            | Screen               | Must include                                                                                                                                                                                                                                                                                                                             |
| -------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                              | Home: the exhibition | Hero; "Objects that shaped us" (Walkman, Macintosh Classic, Game Boy, a digital camera, VHS, floppy); the scroll story of one object (Walkman TPS-L2: invention, popularity, obsolescence, preservation); Device Logbook teaser; Decision Lab teaser; personal-museum teaser; mission; closing call to explore; footer with credits link |
| `/archive`                       | The Archive          | Search; category filters (Audio, Computing, Gaming, Photography, Physical media, Other electronics); period filter (1960s–70s, 1980s, 1990s, 2000s); sort; two display modes (gallery and index); featured selection; hover states; empty state; quick look; link to Logbook                                                             |
| `/objects/:id`                   | Device Logbook       | Hero photo; name and period; category and maker; specifications; historical context; original uses; condition; preservation advice; repair log; archival timeline (the model's history next to this object's history); a short memory labelled as sample; related objects; save to collection                                            |
| `/lab`                           | Decision Lab         | Step A: pick a device. Step B: four condition sliders. Step C: six futures, visually branched and ranked. Step D: compare priorities. Reset; spoken feedback when a value changes; "How this works" panel                                                                                                                                |
| `/collection`                    | My Collection        | Overview counts; timeline of owned objects; search and status filters; add a device; edit a Logbook (form with validation); remove with confirmation; empty state. Shows a sign-in gate when signed out                                                                                                                                  |
| `/signin`, `/register`, `/reset` | Authentication       | Sign in, create account, forgotten password (with "check your inbox" state), signed-out gate; accessible forms with inline validation                                                                                                                                                                                                    |
| `/credits`                       | Photo credits        | Table of every photograph with author, licence and source link                                                                                                                                                                                                                                                                           |

User journeys that must work end to end:

- **A.** Home → Archive → filter → open object → save → My Collection.
- **B.** Home → Decision Lab → pick device → change criteria → explore outcomes → reset.
- **C.** Sign in → My Collection → add a device Logbook → edit it → back to the collection.

## Design direction: cassette futurism

The team chose **retro-futurism, in its cassette-futurism flavour**: the future as imagined in the late 1970s and 1980s. Translate it for RELIK like this. **The site is an archive terminal and a rack of hardware in a museum store room.** Each section is a piece of equipment, each device is a specimen placed in a lit bay, and the visitor operates the archive.

**References to draw from** (synthesise them, never copy one):

- late-70s and 80s hi-fi cassette decks, with their transport keys, VU meters and tape counters;
- Braun and Dieter Rams-era product design: putty plastics, graphite, one orange accent;
- mission-control consoles, and amber and green monochrome CRT terminals;
- vacuum fluorescent displays (VFD) and seven-segment readouts;
- Dymo embossed label tape, cassette J-card typography, Teletext and Minitel grids, and engineering service manuals.

**Mood:** precise, warm, tactile and slightly nostalgic. Credible museum quality, not a costume.

### Starting tokens

Refine these with the ui-ux-pro-max design system and keep every contrast rule.

| Role         | Token          | Start value        | Use                                                                                                                                   |
| ------------ | -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Casing       | `--putty`      | `#E4DCCB`          | Light panels, page ground of "hardware" rooms                                                                                         |
| Casing shade | `--putty-deep` | `#CFC5B0`          | Panel insets, bays, dividers                                                                                                          |
| Bezel        | `--graphite`   | `#1C1D1F`          | Dark rooms, nav, screen surrounds, primary text on putty                                                                              |
| Panel        | `--panel`      | `#2A2B2E`          | Raised dark surfaces                                                                                                                  |
| Screen       | `--crt`        | `#0B0D0A`          | CRT and VFD screens                                                                                                                   |
| Phosphor     | `--amber`      | `#FFB000`          | Text and readouts **on screens only** (about 11:1 on `--crt`)                                                                         |
| Indicator    | `--signal`     | `#FF5A1F`          | One accent: LEDs, active state, record and primary hover. It is a fill colour with graphite text. Never use it as body text on putty. |
| Muted ink    | `--ink-muted`  | `#5A5448` on putty | Secondary text (check 4.5:1)                                                                                                          |

- At most one more accent, for example a cool VFD cyan-green such as `#7FE3CF`, and only on dark screens.
- Do not use a red/green pair to mean good/bad. Words and segment counts carry the meaning.

### Typography candidates

Validate these with the skills. Never use Orbitron, Audiowide or other clichéd sci-fi faces, and no Inter or Space Grotesk.

- **Display:** a wide 70s-hardware grotesk, e.g. _Archivo_ at expanded widths (variable `wdth` axis) in heavy weights, or _Michroma_ for short logotype-like labels only.
- **Body:** _IBM Plex Sans_ (computing heritage, very legible).
- **Data and labels:** _IBM Plex Mono_.
- **Screen readouts:** _VT323_, used only at 20px or larger for short CRT text, never for paragraphs.

### Visual vocabulary to UI mapping

| Metaphor                                                    | UI component                                                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| Equipment faceplate with screws and a model plate           | Section container (`Panel`)                                         |
| Specimen bay: recessed, lit from above, with a floor shadow | Object card with the cut-out photograph (`SpecimenBay`)             |
| Dymo label tape (black tape, raised white letters)          | Accession numbers `RLK·1979·001`, tags (`DymoLabel`)                |
| CRT or VFD screen with scanlines and soft glow              | Hero readout, search prompt, Decision Lab output (`Screen`)         |
| Cassette deck transport keys                                | Primary actions and chapter navigation (`TransportKey`)             |
| Toggle and rocker switches                                  | Filters and settings (`Switch`, really a checkbox or radio)         |
| Mixing-desk faders                                          | Decision Lab condition sliders (`Fader`, really `input type=range`) |
| Segmented LED / VU meter                                    | Fit level of each future (`LedMeter`, with the fit as a word too)   |
| Mechanical tape counter                                     | Result counts, years on timelines (`TapeCounter`)                   |
| Side A / Side B, tracks                                     | Chapters of the scroll story                                        |
| Service manual and spec sheet                               | Device Logbook layout                                               |
| Cassette spines in a rack                                   | My Collection list view                                             |

### Effects budget

Effects stay subtle and serve legibility.

- **Scanlines:** at most about 8% opacity, only on screen components, never over body text.
- **Screen glow:** a soft `text-shadow` or `box-shadow`, no bloom on long text.
- **Grain:** very faint, static or slow.
- **Flicker:** none faster than 3 flashes per second (WCAG 2.3.1). Prefer no flicker.
- Provide a footer switch, **"CRT effects: on/off"**, and default it to off when `prefers-reduced-motion` is set.
- At most **three** React Bits components in the whole site, each used where it means something:
  - a terminal text effect such as Decrypted, Scrambled or Shuffle text for the hero readout;
  - a CRT-style background used once, behind the hero screen only;
  - noise or grain.
- No 3D, except an optional single-object turntable on the Walkman Logbook, as a late extra.

### Imagery

- Real photographs only, already in this repo:
  - `photos/objects/*.webp`: transparent cut-outs of 19 devices;
  - `photos/photographs/*.webp`: context photographs.
- Credits are in the `CREDITS.md` file in each folder. Copy the images into `site/public/images/` and keep every credit on `/credits`.
- Present objects in specimen bays on putty or graphite with a floor shadow. Do not recolour or distort the photographs. Do not add stock photos or AI-generated devices.

### Never

- Synthwave sunsets, neon grids, chrome lettering, purple or blue gradients, glassmorphism.
- Cyberpunk glitch overload or a childish pixel-art game UI.
- Generic SaaS hero (text left, card right), uniform three-column card grids everywhere, emoji, icon tiles above every heading.
- Invented testimonials, partner logos, awards or meaningless counters.

## Content rules

- **Voice:** a calm, curious curator who also runs the archive terminal. Short sentences, sentence case.
  - Uppercase only in mono labels and screen readouts.
  - Terminal-style microcopy is welcome in small doses (`> SEARCH ARCHIVE_`). Never let it hide meaning.
- **Facts:** use `docs/relik-seed-data.json`. Do not invent dates, specs or prices.
  - Uncertain dates take "c."
  - Every invented memory, condition note or repair log entry is labelled **Sample**.
  - Decision Lab results always say "illustrative, sample assumptions".
- **i18n-ready:** keep all copy in `src/content/en.js` (objects and pages), not hard-coded in components. Allow 30% longer French strings, and put no text inside images.

## Accessibility (WCAG 2.2 AA)

- **Contrast:** 4.5:1 for text, 3:1 for large text, control borders, focus rings and meaningful icons. Check amber on CRT and graphite on putty.
- **Real elements:** every control is a real `button`, `a`, `input` or `label`, operable by keyboard.
- **Focus:** a visible focus ring (2px, high contrast) everywhere.
- **Hit targets:** 44px or more.
- **Reduced motion:** `prefers-reduced-motion` disables boot sequences, pinning, scrubbing, flicker and floating. All content stays readable without JavaScript animation.
- **Live feedback:** Decision Lab changes, saves and form errors are announced in `aria-live` regions.
- **Images:** descriptive `alt` text for every object photograph.

## Tech stack and conventions

- **App:** React 18+ with Vite, in **JavaScript (JSX)**, in `site/` (create it there). Use React Router for routes.
- **Styling:** CSS Modules plus global design tokens in `site/src/styles/tokens.css`.
  - No UI kit (no MUI, Chakra or Bootstrap).
  - Tailwind only if the team asks for it.
- **Motion:**
  - `gsap` (all plugins are free on npm: ScrollTrigger, SplitText, ScrambleText, Flip, DrawSVG) with `@gsap/react` (`useGSAP`);
  - smooth scroll with `lenis` (`import { ReactLenis } from 'lenis/react'`, `import 'lenis/dist/lenis.css'`), synced to `gsap.ticker`;
  - one `useReducedMotion` hook that every animation respects.
- **React Bits:** install the **JS-CSS** variants only, e.g. `npx shadcn@latest add @react-bits/DecryptedText-JS-CSS`, respecting the budget above.
- **State:** React state and context. Persist the session, the collection and saved objects in `localStorage` under `relik:*` keys, wrapped in try/catch.
- **Data:**
  - `site/src/data/objects.js` comes from `docs/relik-seed-data.json`;
  - the Decision Lab model lives in `site/src/lab/model.js`, as a pure function with unit tests.
- **Suggested structure:**

  ```
  site/src/{app,routes,components,lab,data,content,services,hooks,styles}
  ```

  One component per folder with `Component.jsx` and `Component.module.css`.

- **Dependencies:** ask before adding any dependency not named here.

## Decision Lab model (sample assumptions; keep these exact rules)

**Inputs.** Each input is 1–5 and maps to 0–1 as `(v − 1) / 4`. Each level also has a word:

- `f`, does it work: Dead, Barely, Partly, Mostly, Fully;
- `R`, repairability: Sealed, Hard, Possible, Easy, Trivial;
- `U`, usefulness today: Never, Rarely, Sometimes, Often, Daily;
- `C`, cultural interest: Common, Modest, Notable, Significant, Landmark.

**Scores:**

```
repair   = f < 1 ? 0.45R + 0.35(1−f) + 0.2·max(U, C) : 0.15R
reuse    = 0.55f + 0.45U
donate   = 0.3f + 0.2U + 0.2R + 0.3C
preserve = 0.65C + 0.2(1−U) + 0.15f
parts    = (0.5(1−f) + 0.3(1−R) + 0.2(1−U)) · (1 − 0.4C)
recycle  = (0.35(1−f) + 0.35(1−R) + 0.3(1−U)) · (1 − 0.6C)
```

**Priority multipliers.** Balanced uses ×1 for all.

- Keep it working: repair ×1.2, reuse ×1.25, donate ×1.15.
- Keep its history: repair ×1.05, donate ×1.1, preserve ×1.3.
- Recover materials: parts ×1.35, recycle ×1.3.

Cap every score at 1.

**Fit:** ≥ 0.65 is "Strong fit" and ≥ 0.45 is "Possible"; anything lower is "Unlikely". Show words, ranks and meter segments, never raw decimals. Device presets are in the seed data.

## Commands (run inside `site/`)

`npm install` · `npm run dev` · `npm run build` · `npm run preview` · `npm run test` (Vitest, for `lab/model.js` and the services)

## How to work in this repo

- **Reading order:** this file, then `PRODUCT.md` and `DESIGN.md` (written by impeccable), then `design-system/relik/MASTER.md` and its `pages/*.md` overrides (written by ui-ux-pro-max).
  - If they disagree, **this file wins** on scope, content and accessibility.
  - The design-system files win on exact values.
- **Plan first** with `/impeccable shape` for any new screen. Build, then review with `/impeccable critique` and `/impeccable audit` and fix the P0–P1 findings before moving on.
- **Verify visually** at 1440px and 390px (webapp-testing skill or Playwright screenshots), and walk journeys A, B and C after each major screen.
- **Mobile:** redesign it, don't just scale it down. Filters go in a bottom sheet, the Lab becomes a step-by-step flow, the Logbook gets a sticky save bar, and the menu is full-screen.
- **Commits:** small, with clear messages. Never commit `node_modules` or secrets.

## Definition of done

- All routes work.
- Journeys A, B and C work with sample data.
- No console errors, and `npm run build` passes.
- Lighthouse accessibility 95 or higher on Home, Archive and Lab.
- Reduced-motion mode is checked, and the CRT-effects switch works.
- Every photograph is credited.
- `docs/ARCHITECTURE.md` explains the structure in one page.
