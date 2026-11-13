// Builds the Express app. index.js starts it; the tests start it on a spare port.
import express from 'express'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { authRouter } from './routes/auth.js'
import { collectionRouter } from './routes/collection.js'
import { objectsRouter } from './routes/objects.js'
import { ensureDemoAccount } from './demo.js'
import { sendError } from './http.js'

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))

// options.serveSite: also serve the built site from dist/ (only with `npm start`).
export function createApp(db, { serveSite = false } = {}) {
  ensureDemoAccount(db)
  const app = express()
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRouter(db))
  app.use('/api/collection', collectionRouter(db))
  app.use('/api/objects', objectsRouter())

  // Any other /api address does not exist.
  app.use('/api', (req, res) => sendError(res, 404, 'notFound'))

  // With `npm start` (which builds first), the same server also serves the site,
  // so everything runs on one port. Unknown paths get index.html and
  // React Router shows the right page (or the 404 page).
  if (serveSite && existsSync(distDir)) {
    app.use(express.static(distDir))
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next()
      res.sendFile('index.html', { root: distDir })
    })
  } else {
    // In development the site comes from Vite, never from an old build in dist/.
    app.get('/', (req, res) => {
      res.type('text').send('This is the RELIK API. Open the site at http://localhost:5173 (npm run dev:all).')
    })
  }

  // Broken JSON in a request body, or any unexpected error.
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return sendError(res, 400, 'badRequest')
    console.error(error)
    sendError(res, 500, 'serverError')
  })

  return app
}
