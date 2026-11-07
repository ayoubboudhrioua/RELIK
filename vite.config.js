import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config. `npm run test` uses the same file through Vitest.
export default defineConfig({
  plugins: [react()],
  server: {
    // The seed data lives one level up, in ../docs/relik-seed-data.json.
    fs: { allow: ['..'] },
  },
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
    // Playwright journeys live in e2e/ and run with `npm run test:e2e`.
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
