import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen/Screen.jsx'
import { Icon } from '../../components/Icon/Icon.jsx'
import { objects } from '../../data/objects.js'
import { filterObjects } from '../../data/archiveQuery.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { en } from '../../content/en.js'
import { NoSignal } from './Nosignal.jsx'
import styles from './HeroTv.module.css'

const t = en.home.hero
const CYCLE_MS = 5000
const BOOT_KEY = 'relik:booted'

function alreadyBooted() {
  try {
    return window.sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return true
  }
}

export function HeroTv({ className = '' }) {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const [powerOn] = useState(() => !alreadyBooted())
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)

  const typed = query.trim()
  const matches = useMemo(() => (typed ? filterObjects(objects, { q: typed }) : []), [typed])
  const noMatch = typed !== '' && matches.length === 0
  const object = matches[0] ?? objects[index]
  const noMatchText = t.noMatch.replace('{query}', typed)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      // Storage unavailable: the TV simply powers on again next time.
    }
  }, [])

  useEffect(() => {
    if (typed || held || reducedMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % objects.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [typed, held, reducedMotion])

  const osd = typed
    ? t.osdFound.replace('{count}', matches.length)
    : t.osdChannel.replace('{n}', String(index + 1).padStart(2, '0'))

  function search(event) {
    event.preventDefault()
    navigate(typed ? `/archive?q=${encodeURIComponent(typed)}` : '/archive')
  }

  return (
    <figure
      className={`${styles.root} ${className}`}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <Screen frame="tv" powerOn={powerOn} label={t.screenLabel} contentClassName={styles.picture}>
        {!noMatch && (
          <span className={styles.osd} aria-hidden="true">
            {osd}
          </span>
        )}

        {noMatch ? (
          <NoSignal className={styles.static} />
        ) : (
          <Link to={`/objects/${object.id}`} className={styles.photoLink} tabIndex={-1} aria-hidden="true">
            <img key={object.id} className={styles.photo} src={`/images/${object.image}`} alt="" decoding="async" />
          </Link>
        )}

        <form role="search" className={styles.command} onSubmit={search}>
          <label htmlFor="hero-search" className="visually-hidden">
            {t.searchLabel}
          </label>
          <span className={styles.prompt} aria-hidden="true">
            &gt;
          </span>
          <input
            id="hero-search"
            type="search"
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.commandPlaceholder}
            autoComplete="off"
          />
          <button type="submit" className={styles.enter}>
            <Icon name="enter" size={20} />
            <span className="visually-hidden">{t.searchSubmit}</span>
          </button>
          <span className="visually-hidden" role="status">
            {noMatch ? noMatchText : ''}
          </span>
        </form>
      </Screen>

      <figcaption className={styles.caption}>
        {noMatch ? (
          <span>{noMatchText}</span>
        ) : (
          <>
            <Link to={`/objects/${object.id}`} className={styles.name}>
              {object.name}
            </Link>
            <span aria-hidden="true">·</span>
            <span>{object.yearLabel}</span>
          </>
        )}
      </figcaption>
    </figure>
  )
}