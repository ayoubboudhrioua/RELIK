// Read-only archive data for the server, from the same file the frontend uses.
import { readFileSync } from 'node:fs'

const seedUrl = new URL('../src/data/relik-seed-data.json', import.meta.url)
export const seed = JSON.parse(readFileSync(seedUrl, 'utf8'))

// Which period (70s, 80s, 90s, 00s) an object belongs to. Same rule as src/data/objects.js.
function periodOf(object) {
  const match = seed.periods.find((p) => object.year >= p.from && object.year <= p.to)
  return match ? match.id : null
}

export const objects = seed.objects.map((object) => ({ ...object, period: periodOf(object) }))
export const categories = seed.categories
export const periodIds = seed.periods.map((p) => p.id)

const byId = new Map(objects.map((object) => [object.id, object]))

export function getObject(id) {
  return byId.get(id) ?? null
}
