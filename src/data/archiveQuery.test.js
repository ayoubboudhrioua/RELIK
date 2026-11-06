import { describe, expect, it } from 'vitest'
import { objects, categories, periods } from './objects.js'
import { filterObjects, countByCategory, readSettings, writeSettings, hasActiveFilters, normalise } from './archiveQuery.js'

const periodIds = periods.map((p) => p.id)

describe('archive search', () => {
  it('finds objects by name, maker or story, ignoring case', () => {
    expect(filterObjects(objects, { q: 'walkman' }).map((o) => o.id)).toContain('walkman-tps-l2')
    expect(filterObjects(objects, { q: 'NINTENDO' }).map((o) => o.id)).toEqual(['game-boy'])
    expect(filterObjects(objects, { q: 'floppy' }).map((o) => o.id)).toEqual(
      expect.arrayContaining(['floppy-3-5', 'digital-mavica-fd85']),
    )
  })

  it('needs every word to match', () => {
    expect(filterObjects(objects, { q: 'sony camera' }).map((o) => o.id)).toEqual(['digital-mavica-fd85'])
  })

  it('ignores accents', () => {
    expect(normalise('Télécom')).toBe('telecom')
  })

  it('returns nothing for an unknown word', () => {
    expect(filterObjects(objects, { q: 'zeppelin' })).toEqual([])
  })
})

describe('archive filters and sort', () => {
  it('filters by category and period together', () => {
    const result = filterObjects(objects, { categories: ['Audio'], period: '90s' })
    expect(result.map((o) => o.id)).toEqual(['rio-pmp300'])
  })

  it('sorts oldest first by default, newest first, or by name', () => {
    expect(filterObjects(objects)[0].id).toBe('compact-cassette') // 1963
    expect(filterObjects(objects, { sort: 'year-desc' })[0].year).toBe(2000)
    const names = filterObjects(objects, { sort: 'name' }).map((o) => o.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('counts each category with the other settings applied', () => {
    const counts = countByCategory(objects, { period: '80s' }, categories)
    expect(counts.Computing).toBe(2) // Commodore 64, Minitel 1
    expect(counts.Audio).toBe(1) // Discman D-50
  })
})

describe('archive settings in the address bar', () => {
  it('reads known values and drops unknown ones', () => {
    const params = new URLSearchParams('q=sony&cat=Audio&cat=Toys&period=80s&sort=bogus&view=index')
    expect(readSettings(params, categories, periodIds)).toEqual({
      q: 'sony',
      categories: ['Audio'],
      period: '80s',
      sort: 'year-asc',
      view: 'index',
    })
  })

  it('writes only what differs from the defaults', () => {
    const params = writeSettings({ q: '', categories: ['Gaming'], period: '', sort: 'year-asc', view: 'gallery' })
    expect(params.toString()).toBe('cat=Gaming')
  })

  it('knows when filters are active', () => {
    expect(hasActiveFilters({ q: '', categories: [], period: '' })).toBe(false)
    expect(hasActiveFilters({ q: 'x', categories: [], period: '' })).toBe(true)
  })
})
