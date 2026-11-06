# RELIK

> Technology never truly disappears.

**Status: work in progress.** A student prototype; content and features are still changing.

RELIK is an interactive digital museum of forgotten electronic devices and physical media
(cassette players, early computers, consoles, cameras, VHS, floppy disks). It combines:

- **An archive**: every object has a documented identity, its *Device Passport*.
- **A Decision Lab**: an illustrative simulation of what could happen to an old device:
  repair, reuse, donation, preservation, parts recovery or recycling.

All data is sample data. Sign-in is simulated and everything is stored in your browser.

## Quick start

Requires Node.js 20.19 or newer.

    npm install
    npm run dev          # http://localhost:5173

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serve the production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | Browser tests (Playwright); run `npx playwright install chromium` once first |

## Built with

React, Vite, React Router, CSS Modules, GSAP, Lenis, Vitest and Playwright.

## Project structure

    src/
      app/         providers, routes, layout
      routes/      one folder per screen
      components/  reusable UI parts
      content/     all interface text (en.js)
      data/        seed data, credits, archive search
      lab/         Decision Lab model (tested)
      services/    simulated auth and collection (localStorage)
      hooks/       shared React hooks
      styles/      design tokens and global styles

## To do

- [ ] French translation (`src/content/fr.js`)
- [ ] Complete passports for more objects
- [ ] Undo after removing an object from a collection
- [ ] Test in Firefox and Safari

## Credits

Photographs come from Wikimedia Commons. Authors and licences are listed on the
`/credits` page of the site.


