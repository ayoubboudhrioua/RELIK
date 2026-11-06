# Product

<!-- impeccable:product-schema 1 -->

<!-- Init answers were taken from CLAUDE.md at the team's request (no separate interview). CLAUDE.md wins on scope, content and accessibility. -->

## Platform

web

## Stack

React 18+ with Vite, JavaScript (JSX), React Router, CSS Modules plus global tokens in `site/src/styles/tokens.css`. Motion with GSAP (+ `@gsap/react`) and Lenis. Tests with Vitest. No UI kit. App lives in `site/`. Fixed by CLAUDE.md.

## Users

1. **Collectors and enthusiasts.** They catalogue objects, keep anecdotes and browse records.
2. **Clubs, associations and makerspaces.** They hold a small inventory and compare reuse or preservation options.
3. **Families and non-specialists.** They found an old device and want to know what it is and what to do before throwing it away.
4. **Students, teachers and the curious.** They explore the history of technology.

Shared needs: simple vocabulary, category navigation, a visible search, structured records, technical terms explained, nothing that relies on colour alone.

## Product Purpose

RELIK is an interactive digital museum of forgotten electronic devices and physical media (cameras, cassette players, consoles, early computers, MP3 players, CDs, VHS, floppy disks). Tagline: "Technology never truly disappears."

It joins two ideas:
- **An archive.** Each device gets a documented identity, the Device Passport.
- **A Decision Lab.** It shows, for teaching, what could happen to an old device: repair, reuse, donation, preservation, parts recovery or recycling.

Success for the prototype: journeys A (Home → Archive → filter → object → save → Collection), B (Home → Lab → pick device → change criteria → outcomes → reset) and C (Sign in → Collection → add passport → edit → back) work end to end with sample data, accessibly.

## Positioning

Founding idea: *an object can lose its commercial value without losing its historical, practical, cultural or emotional value.* RELIK documents those values before the object disappears, then helps people decide what happens next. It is **not** a shop, a marketplace or a recycling-company dashboard.

## Operating Context

University web development course ("Projet Web"), SUP'COM, Université de Carthage, 2026/2027. Groupe 2: Ayoub Boudhrioua and Mohamed Amine Elghzel. Supervisor: Dr. Maroua Nouioua. First-year engineering students will maintain the code, so it must stay readable.

## Capabilities and Constraints

- In scope: home page, archive with search and filters, Device Passport pages from sample data, working Decision Lab simulation, personal collection, **simulated** sign-up, sign-in and sign-out.
- Out of scope: real backend, database, email or photo storage; public contributions, moderation, QR codes, verified passport history; advanced allocation engine, full Sankey, exportable reports.
- Mock services keep a real-service interface and are labelled honestly ("Simulated sign-in", "Sample data").
- Decision Lab uses the exact sample model in CLAUDE.md; results always say "illustrative, sample assumptions" and show words, ranks and meter segments, never raw decimals.
- All copy lives in `src/content/en.js`. English first, French later; allow 30% longer strings; no text inside images.

## Brand Commitments

- Name RELIK; tagline "Technology never truly disappears."
- Voice: a calm, curious curator who also runs the archive terminal. Short sentences, sentence case; uppercase only in mono labels and screen readouts; terminal microcopy in small doses that never hides meaning.
- Binding visual direction chosen by the team: **cassette futurism** (the future as imagined in the late 1970s and 1980s). The site is an archive terminal and a rack of hardware in a museum store room. Details are in CLAUDE.md and DESIGN.md.

## Evidence on Hand

- Facts: `docs/relik-seed-data.json` (18 objects, Walkman story and passport, Lab presets and outcomes, sample collection, mission). Do not invent dates, specs or prices; uncertain dates take "c.".
- Photographs: `photos/objects/*.webp` (19 transparent cut-outs) and `photos/photographs/*.webp` (6 context photos), all Wikimedia Commons, credited in each folder's `CREDITS.md`.
- Absent and must not be fabricated: testimonials, partner logos, awards, usage statistics, real user memories. Every invented memory, condition note or repair log entry is labelled **Sample**.

## Product Principles

1. **Honest archive.** Real facts from the seed data, sample content labelled, simulations named as simulations.
2. **Value beyond price.** Every screen treats an object's history, use and meaning as worth recording.
3. **Decide before discarding.** The Lab teaches options; it never sells or prescribes.
4. **Plain words first.** Any visitor, specialist or not, can find, read and act.
5. **Maintainable by students.** Small components, plain names, no clever abstractions.

## Accessibility & Inclusion

WCAG 2.2 AA: 4.5:1 text contrast (3:1 large text, control borders, focus rings, meaningful icons); real keyboard-operable elements; visible 2px focus ring; 44px hit targets; `prefers-reduced-motion` disables boot sequences, pinning, scrubbing, flicker and floating; `aria-live` for Lab changes, saves and form errors; descriptive alt text for every object photograph; nothing faster than 3 flashes per second; a footer "CRT effects: on/off" switch. Lighthouse accessibility ≥ 95 on Home, Archive and Lab.
