// All facts about the objects come from one file: docs/relik-seed-data.json.
// This module reads it once and adds what the interface needs
// (alt text, period, Logbook details) so components never touch the JSON.
import seed from './relik-seed-data.json'
import { en } from '../content/en.js'

export const categories = seed.categories
export const periods = seed.periods
export const mission = seed.mission

// Which period (70s, 80s, 90s, 00s) an object belongs to.
export function periodOf(object) {
  const match = periods.find((p) => object.year >= p.from && object.year <= p.to)
  return match ? match.id : null
}

export const objects = seed.objects.map((object) => ({
  ...object,
  period: periodOf(object),
  alt: en.objectAlt[object.image] ?? object.name,
  altImageAlt: object.altImage ? en.objectAlt[object.altImage] : undefined,
}))

const byId = new Map(objects.map((object) => [object.id, object]))

export function getObject(id) {
  return byId.get(id) ?? null
}

export const homeSelection = seed.homeSelection.map(getObject)

export const featuredSelection = {
  ...seed.featuredSelection,
  photoAlt: en.objectAlt[seed.featuredSelection.photo],
  objects: seed.featuredSelection.objects.map(getObject),
}

export const walkmanStory = seed.walkmanStory.map((chapter) => ({
  ...chapter,
  photoAlt: chapter.photo ? en.objectAlt[chapter.photo] : undefined,
}))

// Only the Walkman has a full Logbook in the seed data.
// Every other object shows what the seed has (story, condition, year, maker).
export function getLogbook(id) {
  if (id !== 'walkman-tps-l2') return null
  const p = seed.walkmanLogbook
  return {
    ...p,
    related: p.related.map(getObject).filter(Boolean),
  }
}

export const labPresets = seed.labPresets.map((preset) => ({
  ...preset,
  object: getObject(preset.objectId),
}))

export const labOutcomes = seed.labOutcomes

export const sampleCollection = seed.sampleCollection

export const dataNotes = seed._notes
