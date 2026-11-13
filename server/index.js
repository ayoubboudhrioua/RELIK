// Starts the RELIK API.
//   node server/index.js                     port 3001, data in server/data/db.json
//   node server/index.js --port 3002         another port
//   node server/index.js --db some.json      another data file
//   node server/index.js --fresh             start from an empty database (used by the browser tests)
//   node server/index.js --site              also serve the built site from dist/ (npm start)
import { fileURLToPath } from 'node:url'
import { createDb } from './db.js'
import { createApp } from './app.js'

function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? fallback : process.argv[index + 1]
}

const port = Number(option('port', process.env.PORT ?? 3001))
const file = option('db', fileURLToPath(new URL('./data/db.json', import.meta.url)))
const fresh = process.argv.includes('--fresh')
const serveSite = process.argv.includes('--site')

const db = createDb({ file, fresh })
const app = createApp(db, { serveSite })

app.listen(port, () => {
  console.log(`RELIK API listening on http://localhost:${port}  (data: ${file}${fresh ? ', fresh' : ''})`)
  if (serveSite) console.log(`RELIK site (built) on http://localhost:${port}`)
})
