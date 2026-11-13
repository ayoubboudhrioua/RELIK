// The visitor's collection.
// - Signed-in visitors: the list lives on the RELIK server (server/routes/collection.js).
// - Signed-out visitors: saved archive objects wait in this browser under relik:saved
//   and join the collection at the next sign-in (mergeGuestSaves).
// Functions that talk to the server are async and throw an ApiError on failure.

import { readStorage, writeStorage, removeStorage } from './storage.js'
import { getObject } from '../data/objects.js'
import { request } from './api.js'

const GUEST_KEY = 'relik:saved'
export const STATUSES = ['In use', 'Stored', 'Needs repair', 'Preserved']

// ---- Signed-in collection (server) ----

export async function listItems(email) {
  if (!email) return []
  return request('/collection')
}

// data: { name, maker, year, category, status, condition, story }
export async function addItem(email, data) {
  return request('/collection', { method: 'POST', body: data })
}

export async function updateItem(email, id, changes) {
  return request(`/collection/${encodeURIComponent(id)}`, { method: 'PATCH', body: changes })
}

export async function removeItem(email, id) {
  await request(`/collection/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// ---- Saving archive objects ----

export function getGuestSaves() {
  return readStorage(GUEST_KEY, [])
}

export async function isObjectSaved(email, objectId) {
  if (!email) return getGuestSaves().includes(objectId)
  const items = await listItems(email)
  return items.some((item) => item.objectId === objectId)
}

// Returns false for an id that is not in the archive.
export async function saveObject(email, objectId) {
  if (!getObject(objectId)) return false
  if (!email) {
    const saves = getGuestSaves()
    if (!saves.includes(objectId)) writeStorage(GUEST_KEY, [...saves, objectId])
    return true
  }
  // Saving twice is fine: the server keeps one copy.
  await request('/collection', { method: 'POST', body: { objectId } })
  return true
}

export async function unsaveObject(email, objectId) {
  if (!email) {
    writeStorage(GUEST_KEY, getGuestSaves().filter((id) => id !== objectId))
    return
  }
  await request(`/collection/objects/${encodeURIComponent(objectId)}`, { method: 'DELETE' })
}

// Called after sign-in: objects saved while signed out join the collection.
export async function mergeGuestSaves(email) {
  for (const objectId of getGuestSaves()) await saveObject(email, objectId)
  removeStorage(GUEST_KEY)
}
