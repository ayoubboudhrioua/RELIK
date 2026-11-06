import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { objects, homeSelection, featuredSelection, labPresets, getPassport, walkmanStory, periodOf } from './objects.js'
import { photoCredits, creditFor } from './credits.js'
import { en } from '../content/en.js'

const publicImages = join(process.cwd(), 'public', 'images')

describe('seed data', () => {
  it('has 18 objects, each with written alt text and a known period', () => {
    expect(objects).toHaveLength(18)
    for (const object of objects) {
      expect(en.objectAlt[object.image], object.id).toBeTruthy()
      expect(object.period, object.id).not.toBeNull()
    }
  })

  it('resolves every id used by the home page, the featured selection and the Lab', () => {
    expect(homeSelection.every(Boolean)).toBe(true)
    expect(homeSelection).toHaveLength(6)
    expect(featuredSelection.objects.every(Boolean)).toBe(true)
    expect(labPresets.every((preset) => preset.object)).toBe(true)
    expect(getPassport('walkman-tps-l2').related.length).toBe(4)
  })

  it('puts the 1963 cassette in the 1960s–70s period', () => {
    expect(periodOf({ year: 1963 })).toBe('70s')
  })
})

describe('photographs', () => {
  it('credits every image used by the data, and every credited file exists', () => {
    const used = new Set(objects.map((o) => o.image))
    objects.forEach((o) => o.altImage && used.add(o.altImage))
    used.add(featuredSelection.photo)
    walkmanStory.forEach((c) => c.photo && used.add(c.photo))

    for (const file of used) expect(creditFor(file), file).not.toBeNull()
    for (const credit of photoCredits) {
      expect(existsSync(join(publicImages, credit.file)), credit.file).toBe(true)
      expect(credit.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      expect(en.objectAlt[credit.file], credit.file).toBeTruthy()
    }
  })
})
