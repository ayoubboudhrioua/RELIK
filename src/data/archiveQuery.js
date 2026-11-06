// Search, filter and sort for the Archive, as plain functions (tested in archiveQuery.test.js).
// The Archive page keeps these settings in the address bar, e.g.
// /archive?q=sony&cat=Audio&cat=Photography&period=80s&sort=name&view=index

export const SORTS = ['year-asc', 'year-desc', 'name']
export const VIEWS = ['gallery', 'index']

// Lower case and without accents, so "minitel" matches "Minitel" and "telephone" matches "téléphone".
export function normalise(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function matchesQuery(object, query) {
  if (!query) return true
  const haystack = normalise(
    [object.name, object.maker, object.category, object.story, object.accession, object.yearLabel].join(' '),
  )
  // Every word typed must appear somewhere ("sony camera" finds the Mavica).
  return normalise(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

export function filterObjects(objects, { q = '', categories = [], period = '', sort = 'year-asc' } = {}) {
  const result = objects.filter(
    (object) =>
      matchesQuery(object, q) &&
      (categories.length === 0 || categories.includes(object.category)) &&
      (!period || object.period === period),
  )

  const sorted = [...result]
  if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === 'year-desc') sorted.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name))
  else sorted.sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
  return sorted
}

// How many objects each category would show with the other settings kept.
// Used for the counts next to each category switch.
export function countByCategory(objects, settings, categories) {
  const counts = {}
  for (const category of categories) {
    counts[category] = filterObjects(objects, { ...settings, categories: [category] }).length
  }
  return counts
}

// Reads the settings from URLSearchParams, ignoring anything unknown.
export function readSettings(params, knownCategories, knownPeriods) {
  const sort = params.get('sort')
  const view = params.get('view')
  const period = params.get('period')
  return {
    q: params.get('q') ?? '',
    categories: params.getAll('cat').filter((c) => knownCategories.includes(c)),
    period: knownPeriods.includes(period) ? period : '',
    sort: SORTS.includes(sort) ? sort : 'year-asc',
    view: VIEWS.includes(view) ? view : 'gallery',
  }
}

// Writes settings back to URLSearchParams, leaving defaults out of the address.
export function writeSettings(settings) {
  const params = new URLSearchParams()
  if (settings.q) params.set('q', settings.q)
  for (const category of settings.categories) params.append('cat', category)
  if (settings.period) params.set('period', settings.period)
  if (settings.sort && settings.sort !== 'year-asc') params.set('sort', settings.sort)
  if (settings.view && settings.view !== 'gallery') params.set('view', settings.view)
  return params
}

export function hasActiveFilters(settings) {
  return Boolean(settings.q || settings.categories.length || settings.period)
}
