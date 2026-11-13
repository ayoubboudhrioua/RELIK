// Building and editing collection items (a "Logbook" in the interface).
// Plain functions, no Express: easy to read and to test.
import { randomUUID } from 'node:crypto'
import { getObject, seed } from './seed.js'

export const STATUSES = ['In use', 'Stored', 'Needs repair', 'Preserved']

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function yearOrNull(value) {
  return value === '' || value == null ? null : Number(value)
}

// An item made from an archive object (the "Save to collection" button).
export function itemFromObject(object, extra = {}) {
  const now = new Date().toISOString()
  return {
    id: randomUUID(),
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

// An item typed in by the visitor (the "Add a device" form).
export function newItem(data) {
  const now = new Date().toISOString()
  return {
    id: randomUUID(),
    objectId: data.objectId ?? null,
    name: text(data.name),
    maker: text(data.maker),
    year: yearOrNull(data.year),
    category: data.category ?? 'Other electronics',
    status: STATUSES.includes(data.status) ? data.status : 'Stored',
    condition: text(data.condition),
    story: text(data.story),
    isSample: false,
    createdAt: now,
    updatedAt: now,
  }
}

// Only these fields can be changed by the visitor.
const EDITABLE = ['name', 'maker', 'year', 'category', 'status', 'condition', 'story']

export function editItem(item, changes) {
  const updated = { ...item }
  for (const key of EDITABLE) {
    if (!(key in changes)) continue
    if (key === 'year') updated.year = yearOrNull(changes.year)
    else if (key === 'status' || key === 'category') updated[key] = changes[key]
    else updated[key] = text(changes[key])
  }
  // Once the owner edits a sample Logbook, the text is theirs.
  updated.isSample = false
  updated.updatedAt = new Date().toISOString()
  return updated
}

// The demo account starts with the sample collection from the seed data.
// Its stories and conditions are fictional, so they are flagged isSample.
export function sampleItems() {
  return seed.sampleCollection
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
