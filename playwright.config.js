import { defineConfig, devices } from '@playwright/test'

// End-to-end journeys A, B and C plus hardening checks. Run with: npm run test:e2e
// Install the browsers once: npx playwright install chromium firefox webkit
// Playwright starts the API (with an empty test database) and the dev server,
// or reuses ones already running.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    { name: 'safari', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: [
    {
      command: 'node server/index.js --port 3001 --fresh --db test-results/e2e-db.json',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev -- --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
})
