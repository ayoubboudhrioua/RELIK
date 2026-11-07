import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Screen } from '../../components/Screen/Screen.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { SpecimenBay } from '../../components/SpecimenBay/SpecimenBay.jsx'
import { Dialog } from '../../components/Dialog/Dialog.jsx'
import { FilterBank } from './FilterBank.jsx'
import { ArchiveIndex } from './ArchiveIndex.jsx'
import { QuickLook } from './QuickLook.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { objects, categories, periods, featuredSelection } from '../../data/objects.js'
import {
  filterObjects,
  countByCategory,
  readSettings,
  writeSettings,
  hasActiveFilters,
} from '../../data/archiveQuery.js'
import { en } from '../../content/en.js'
import { format, countText } from '../../content/format.js'
import styles from './Archive.module.css'

gsap.registerPlugin(Flip)

const t = en.archive
const periodIds = periods.map((p) => p.id)
let firstVisit = true // the skeleton only shows on the first visit in a session

// The Archive: a card-catalogue terminal. All settings live in the address bar,
// so a search can be bookmarked or shared and the back button works.
export function Archive() {
  usePageTitle(t.pageTitle)
  const reducedMotion = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 820px)')
  const [params, setParams] = useSearchParams()
  // Settings live in React state so switches and the search box respond
  // instantly; an effect mirrors them into the address bar.
  const [settings, setSettings] = useState(() => readSettings(params, categories, periodIds))

  const [loading, setLoading] = useState(firstVisit)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [lookAt, setLookAt] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const resultsRef = useRef(null)
  const flipState = useRef(null)

  // State → address bar.
  const query = writeSettings(settings).toString()
  useEffect(() => {
    if (query !== params.toString()) setParams(new URLSearchParams(query), { replace: true })
    // Only when the settings change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Address bar → state (back button, or a link like /archive?q=floppy).
  const address = params.toString()
  useEffect(() => {
    if (address !== writeSettings(settings).toString()) setSettings(readSettings(params, categories, periodIds))
    // Only when the address changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const results = useMemo(() => filterObjects(objects, settings), [settings])
  const counts = useMemo(() => countByCategory(objects, { ...settings, categories: [] }, categories), [settings])
  const filtering = hasActiveFilters(settings)
  const activeCount = settings.categories.length + (settings.period ? 1 : 0)

  // A short skeleton on the first visit, as if the catalogue were loading.
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      setLoading(false)
      firstVisit = false
    }, reducedMotion ? 0 : 450)
    return () => clearTimeout(timer)
  }, [loading, reducedMotion])

  // Announce the result count politely, after the visitor stops typing.
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(countText(t.resultsAnnounce, results.length)), 600)
    return () => clearTimeout(timer)
  }, [results.length])

  function update(partial) {
    setSettings((current) => ({ ...current, ...partial }))
  }

  function clearFilters() {
    update({ q: '', categories: [], period: '' })
  }

  // Gallery ⇄ Index: remember where each photo is, switch, then let Flip
  // animate the photos from their old place to the new one.
  function changeView(view) {
    if (view === settings.view) return
    if (!reducedMotion && resultsRef.current) {
      flipState.current = Flip.getState(resultsRef.current.querySelectorAll('[data-flip-id]'))
    }
    update({ view })
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !resultsRef.current) return
    flipState.current = null
    Flip.from(state, {
      targets: resultsRef.current.querySelectorAll('[data-flip-id]'),
      duration: 0.6,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
    })
  }, [settings.view])

  const viewKeys = (
    <div className={styles.viewKeys} role="group" aria-label={t.viewLabel}>
      <TransportKey size="sm" pressed={settings.view === 'gallery'} onClick={() => changeView('gallery')}>
        {t.gallery}
      </TransportKey>
      <TransportKey size="sm" pressed={settings.view === 'index'} onClick={() => changeView('index')}>
        {t.index}
      </TransportKey>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* ---- Header room: title and the CRT search ---- */}
      <section className={styles.header} data-room="dark" aria-labelledby="page-title">
        <Backdrop />
        <div className={styles.headerInner}>
          <div className={styles.titleBlock}>
            <h1 id="page-title" className={styles.title}>
              {t.title}
            </h1>
            <p className={styles.intro}>{t.intro}</p>
          </div>

          <Screen className={styles.screen} label={t.searchLabel} contentClassName={styles.screenContent}>
            <form role="search" className={styles.search} onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="archive-search" className={styles.searchLabel}>
                {t.searchPrompt}
                <span className={styles.caret} aria-hidden="true">_</span>
              </label>
              <input
                id="archive-search"
                type="search"
                className={styles.searchInput}
                value={settings.q}
                onChange={(event) => update({ q: event.target.value })}
                placeholder={t.searchPlaceholder}
                aria-describedby="archive-search-hint"
                autoComplete="off"
              />
              <p id="archive-search-hint" className={styles.searchHint}>
                {t.searchHint}
              </p>
            </form>
            <div className={styles.counter}>
              <TapeCounter value={results.length} digits={2} label={t.resultsLabel} size="lg" />
            </div>
          </Screen>
        </div>
      </section>

      {/* ---- The switch bank (wide screens) / filter key (phones) ---- */}
      <section className={styles.controls} aria-label={t.filtersTitle}>
        <div className={styles.bankWide}>
          <FilterBank settings={settings} counts={counts} onChange={update} idPrefix="wide" />
        </div>
        <div className={styles.toolbar}>
          <TransportKey
            size="sm"
            icon="menu"
            className={styles.filterKey}
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
          >
            {t.filtersButton}
            {activeCount > 0 && <span className={styles.activeCount}> ({format(t.activeCount, { count: activeCount })})</span>}
          </TransportKey>
          {filtering && (
            <button type="button" className={styles.clear} onClick={clearFilters}>
              {t.clearFilters}
            </button>
          )}
          {viewKeys}
        </div>
      </section>

      <Dialog open={sheetOpen} onClose={() => setSheetOpen(false)} title={t.filtersTitle}>
        <FilterBank settings={settings} counts={counts} onChange={update} idPrefix="sheet" />
        <div className={styles.sheetActions}>
          <TransportKey variant="signal" icon="play" onClick={() => setSheetOpen(false)}>
            {countText(t.showResults, results.length)}
          </TransportKey>
          {filtering && (
            <button type="button" className={styles.clear} onClick={clearFilters}>
              {t.clearFilters}
            </button>
          )}
        </div>
      </Dialog>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      {/* ---- Featured selection: only when nothing is filtered ---- */}
      {/* Rendered straight away (even while the skeleton shows) so nothing
          above the results moves once the page has loaded. */}
      {!filtering && (
        <section className={styles.featured} data-room="dark" aria-labelledby="featured-title">
          <figure className={styles.featuredFigure}>
            <img
              src={`/images/${featuredSelection.photo}`}
              alt={featuredSelection.photoAlt}
              loading="lazy"
              className={styles.featuredPhoto}
            />
          </figure>
          <div className={styles.featuredBody}>
            <h2 id="featured-title" className={styles.featuredTitle}>
              {featuredSelection.title}
            </h2>
            <p className={styles.featuredText}>{featuredSelection.text}</p>
            <ul role="list" className={styles.featuredList}>
              {featuredSelection.objects.map((object) => (
                <li key={object.id}>
                  <SpecimenBay object={object} to={`/objects/${object.id}`} tone="graphite" size="s" showStory={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- Results ---- */}
      <section className={styles.results} aria-labelledby="results-title" ref={resultsRef}>
        <div className={styles.resultsHead}>
          <h2 id="results-title" className={styles.resultsTitle}>
            {t.resultsLabel}
            <span className={styles.resultsCount}>{results.length}</span>
          </h2>
          {filtering && (
            <button type="button" className={`${styles.clear} ${styles.clearWide}`} onClick={clearFilters}>
              {t.clearFilters}
            </button>
          )}
          <div className={styles.viewWide}>{viewKeys}</div>
        </div>

        {loading ? (
          <ul role="list" className={styles.gallery}>
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <SpecimenBay object={objects[0]} state="loading" size="s" />
              </li>
            ))}
          </ul>
        ) : results.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{t.emptyTitle}</p>
            <p className={styles.emptyText}>{t.emptyText}</p>
            <div className={styles.suggestions}>
              {t.emptySuggestions.map((word) => (
                <TransportKey key={word} size="sm" icon="search" onClick={() => update({ q: word, categories: [], period: '' })}>
                  {word}
                </TransportKey>
              ))}
            </div>
            <TransportKey variant="signal" onClick={clearFilters}>
              {t.clearFilters}
            </TransportKey>
          </div>
        ) : settings.view === 'index' ? (
          <ArchiveIndex objects={results} onQuickLook={setLookAt} />
        ) : (
          <ul role="list" className={styles.gallery} data-stagger="">
            {results.map((object) => (
              <li key={object.id}>
                <SpecimenBay
                  object={object}
                  to={`/objects/${object.id}`}
                  size="s"
                  showStory={!narrow}
                  flipId={object.id}
                  actions={
                    <TransportKey
                      size="sm"
                      icon="search"
                      onClick={() => setLookAt(object)}
                      aria-label={format(t.quickLookFor, { name: object.name })}
                    >
                      {t.quickLook}
                    </TransportKey>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <QuickLook object={lookAt} onClose={() => setLookAt(null)} />
    </div>
  )
}
