import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config. `npm run test` uses the same file through Vitest.
// The RELIK API runs on port 3001 (npm run server). Vite forwards every
// /api/... request to it, so the frontend never needs the server's address.
const api = { '/api': 'http://localhost:3001' }

export default defineConfig({
  plugins: [react()],
  server: { proxy: api },
  preview: { proxy: api },
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
    // Playwright journeys live in e2e/ and run with `npm run test:e2e`.
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
