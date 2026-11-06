// SIMULATED collection store, kept in localStorage.
// - Signed-in visitors: one list per account, under relik:collection:<email>.
// - Signed-out visitors: saved archive objects wait under relik:saved and
//   join the collection at the next sign-in (mergeGuestSaves).
// Every function is synchronous and returns plain data, so it is easy to test.

import { readStorage, writeStorage, removeStorage } from './storage.js'
import { getObject, sampleCollection } from '../data/objects.js'
import { DEMO_ACCOUNT } from './auth.js'

const GUEST_KEY = 'relik:saved'
export const STATUSES = ['In use', 'Stored', 'Needs repair', 'Preserved']

function keyFor(email) {
  return `relik:collection:${email}`
}

function newId() {
  return crypto.randomUUID()
}

// Builds a collection item from an archive object.
function itemFromObject(object, extra = {}) {
  const now = new Date().toISOString()
  return {
    id: newId(),
    objectId: object.id,
    name: object.name,
    maker: object.maker,
    year: object.year,
    category: object.category,
    status: 'Stored',
    condition: '',
    story: '',
    isSample: false,
    createdAt: now,
    updatedAt: now,
    ...extra,
  }
}

// The demo account starts with the sample collection from the seed data.
// Its stories and conditions are fictional, so they are flagged isSample.
function sampleItems() {
  return sampleCollection
    .map((entry) => {
      const object = getObject(entry.objectId)
      if (!object) return null
      return itemFromObject(object, {
        status: STATUSES.includes(entry.status) ? entry.status : 'Stored',
        condition: object.sampleCondition ?? '',
        story: entry.sampleStory ?? '',
        isSample: true,
      })
    })
    .filter(Boolean)
}

export function listItems(email) {
  const saved = readStorage(keyFor(email), null)
  if (saved) return saved
  if (email === DEMO_ACCOUNT.email) {
    const items = sampleItems()
    writeStorage(keyFor(email), items)
    return items
  }
  return []
}

function writeItems(email, items) {
  writeStorage(keyFor(email), items)
  return items
}

export function addItem(email, data) {
  const now = new Date().toISOString()
  const item = {
    id: newId(),
    objectId: data.objectId ?? null,
    name: data.name.trim(),
    maker: data.maker?.trim() ?? '',
    year: data.year === '' || data.year == null ? null : Number(data.year),
    category: data.category ?? 'Other electronics',
    status: data.status ?? 'Stored',
    condition: data.condition?.trim() ?? '',
    story: data.story?.trim() ?? '',
    isSample: false,
    createdAt: now,
    updatedAt: now,
  }
  writeItems(email, [item, ...listItems(email)])
  return item
}

export function updateItem(email, id, changes) {
  let updated = null
  const items = listItems(email).map((item) => {
    if (item.id !== id) return item
    updated = {
      ...item,
      ...changes,
      year: changes.year === '' ? null : changes.year != null ? Number(changes.year) : item.year,
      // Once the owner edits a sample passport, the text is theirs.
      isSample: false,
      updatedAt: new Date().toISOString(),
    }
    return updated
  })
  writeItems(email, items)
  return updated
}

export function removeItem(email, id) {
  writeItems(email, listItems(email).filter((item) => item.id !== id))
}

// ---- Saving archive objects ----

export function getGuestSaves() {
  return readStorage(GUEST_KEY, [])
}

export function isObjectSaved(email, objectId) {
  if (!email) return getGuestSaves().includes(objectId)
  return listItems(email).some((item) => item.objectId === objectId)
}

export function saveObject(email, objectId) {
  const object = getObject(objectId)
  if (!object) return false
  if (isObjectSaved(email, objectId)) return true

  if (!email) {
    writeStorage(GUEST_KEY, [...getGuestSaves(), objectId])
    return true
  }
  writeItems(email, [itemFromObject(object), ...listItems(email)])
  return true
}

export function unsaveObject(email, objectId) {
  if (!email) {
    writeStorage(GUEST_KEY, getGuestSaves().filter((id) => id !== objectId))
    return
  }
  writeItems(email, listItems(email).filter((item) => item.objectId !== objectId))
}

// Called after sign-in: objects saved while signed out join the collection.
export function mergeGuestSaves(email) {
  for (const objectId of getGuestSaves()) saveObject(email, objectId)
  removeStorage(GUEST_KEY)
}
