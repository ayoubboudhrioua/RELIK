import { describe, expect, it } from 'vitest'
import { normalise, scoreFutures, rankFutures, fitFor, segmentsFor, PRIORITIES } from './model.js'

// Device presets from docs/relik-seed-data.json (labPresets): [f, R, U, C] on the 1–5 scale.
const presets = {
  macintosh: [2, 3, 1, 4],
  rio: [1, 2, 1, 3],
  nokia: [4, 3, 3, 2],
  walkman: [3, 4, 2, 5],
}

function inputs([f, R, U, C]) {
  return { f, R, U, C }
}

describe('normalise', () => {
  it('maps 1–5 to 0–1 with (v − 1) / 4', () => {
    expect(normalise(1)).toBe(0)
    expect(normalise(3)).toBe(0.5)
    expect(normalise(5)).toBe(1)
  })
})

describe('scoreFutures (balanced)', () => {
  it('matches hand-calculated scores for the Macintosh Classic', () => {
    const s = scoreFutures(inputs(presets.macintosh))
    expect(s.repair).toBeCloseTo(0.6375)
    expect(s.reuse).toBeCloseTo(0.1375)
    expect(s.donate).toBeCloseTo(0.4)
    expect(s.preserve).toBeCloseTo(0.725)
    expect(s.parts).toBeCloseTo(0.5075)
    expect(s.recycle).toBeCloseTo(0.405625)
  })

  it('uses 0.15R for repair when the device fully works', () => {
    const s = scoreFutures({ f: 5, R: 5, U: 5, C: 5 })
    expect(s.repair).toBeCloseTo(0.15)
  })

  it('never returns a score above 1, even with multipliers', () => {
    for (const priority of Object.keys(PRIORITIES)) {
      const s = scoreFutures({ f: 1, R: 1, U: 1, C: 5 }, priority)
      for (const value of Object.values(s)) expect(value).toBeLessThanOrEqual(1)
    }
  })
})

describe('top future with the balanced priority', () => {
  it.each([
    ['Macintosh Classic', presets.macintosh, 'preserve'],
    ['Rio PMP300', presets.rio, 'parts'],
    ['Nokia 3310', presets.nokia, 'reuse'],
    ['Walkman TPS-L2', presets.walkman, 'preserve'],
  ])('%s → %s', (_name, values, expected) => {
    const ranked = rankFutures(inputs(values), 'balanced')
    expect(ranked[0].id).toBe(expected)
  })
})

describe('priorities', () => {
  it('"Recover materials" multiplies parts by 1.35 and recycle by 1.3', () => {
    const base = scoreFutures(inputs(presets.macintosh), 'balanced')
    const materials = scoreFutures(inputs(presets.macintosh), 'materials')
    expect(materials.parts).toBeCloseTo(Math.min(1, base.parts * 1.35))
    expect(materials.recycle).toBeCloseTo(Math.min(1, base.recycle * 1.3))
    expect(materials.preserve).toBeCloseTo(base.preserve)
  })

  it('"Keep it working" lifts reuse for the Nokia 3310', () => {
    const base = scoreFutures(inputs(presets.nokia), 'balanced')
    const working = scoreFutures(inputs(presets.nokia), 'working')
    expect(working.reuse).toBeCloseTo(base.reuse * 1.25)
  })
})

describe('rankFutures', () => {
  it('returns six futures with ranks 1 to 6, best first', () => {
    const ranked = rankFutures(inputs(presets.walkman))
    expect(ranked).toHaveLength(6)
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6])
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score)
    }
  })

  it('gives each future a fit word and a segment count', () => {
    const [top] = rankFutures(inputs(presets.walkman))
    expect(top.fit).toBe('strong')
    expect(top.segments).toBe(9)
  })
})

describe('fitFor and segmentsFor', () => {
  it('uses the thresholds 0.65 and 0.45', () => {
    expect(fitFor(0.65)).toBe('strong')
    expect(fitFor(0.649)).toBe('possible')
    expect(fitFor(0.45)).toBe('possible')
    expect(fitFor(0.449)).toBe('unlikely')
  })

  it('lights one segment per tenth, rounded', () => {
    expect(segmentsFor(0)).toBe(0)
    expect(segmentsFor(0.44)).toBe(4)
    expect(segmentsFor(0.45)).toBe(5)
    expect(segmentsFor(1)).toBe(10)
  })
})
