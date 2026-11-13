// A tiny JSON-file database. Good enough for a course project:
// everything lives in memory and is written to disk after each change.
//
// Shape of the file:
// {
//   users:       { "<email>": { name, email, passwordHash } },
//   sessions:    { "<token>": "<email>" },
//   collections: { "<email>": [ item, item, ... ] }
// }
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

function emptyData() {
  return { users: {}, sessions: {}, collections: {} }
}

// file: where to keep the data. fresh: start from an empty database.
// Without a file (tests), the data only lives in memory.
export function createDb({ file = null, fresh = false } = {}) {
  let data = emptyData()

  if (file && !fresh && existsSync(file)) {
    try {
      data = { ...emptyData(), ...JSON.parse(readFileSync(file, 'utf8')) }
    } catch {
      console.warn(`[db] ${file} is not valid JSON, starting with an empty database.`)
    }
  }

  function save() {
    if (!file) return
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify(data, null, 2))
  }

  save()
  return { data, save }
}
