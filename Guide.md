You need

Git;
Node.js 20.19 or newer (22 LTS recommended). Check with node --version.
1. Get the code


git clone https://github.com/ayoubboudhrioua/relik.git
cd relik
npm install
npx playwright install chromium    # once; needed for the end-to-end tests
2. Run it


npm run dev
Open http://localhost:5173.

3. Try the three journeys by hand

A: Home → Explore the Archive → turn on a category switch → open an object → Save to collection → My collection → Sign in.
B: Home → Enter the Decision Lab → pick a device → move the faders (mouse, or the arrow keys) → change the priority → Reset.
C: Sign in → Create an account, or use Use the demo account (demo@relik.example / relik-demo) → Add a device → submit it empty to see the errors → fill it in → Edit passport → Remove.
4. Useful extras

/styleguide: every component in every state (development only).
Add ?pseudo to any address (e.g. /lab?pseudo) to make all text about 30% longer, roughly French length. Nothing should overflow.
The footer switch turns CRT effects (scanlines and glow) on and off.
Accounts and collections are simulated and stored in your browser. To reset, open DevTools → Application → Local Storage → delete the relik:* keys.
5. Automated checks


npm run test        # unit tests: Lab model, services, archive search, data and credits
npm run test:e2e    # browser tests: journeys A, B, C, long input, keyboard-only (desktop and phone)
npm run build       # production build in dist/
npm run preview     # serve that build at http://localhost:4173
If an e2e test fails, npx playwright show-report opens the details.

6. Working together


git checkout -b my-change          # one branch per change
# ...edit, then:
npm run test && npm run test:e2e
git add -A
git commit -m "Short description of the change"
git push -u origin my-change       # then open a Pull Request on GitHub
All interface text lives in src/content/en.js.
Object facts live in src/data/relik-seed-data.json.
docs/ARCHITECTURE.md explains how the parts fit together (if you copied it in Step 1).