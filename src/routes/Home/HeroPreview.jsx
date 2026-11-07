import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Screen } from '../../components/Screen/Screen.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { objects } from '../../data/objects.js'
import { filterObjects } from '../../data/archiveQuery.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { en } from '../../content/en.js'
import styles from './Hero.module.css'

const t = en.home.hero
const CYCLE_MS = 5000
const pad = (n) => String(n).padStart(2, '0')

export function HeroPreview({ query = '' }) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const typed = query.trim()
  const matches = useMemo(() => (typed ? filterObjects(objects, { q: typed }) : []), [typed])

  useEffect(() => {
    if (typed || held || reducedMotion) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % objects.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [typed, held, reducedMotion])

  const noMatch = typed && matches.length === 0
  const object = matches[0] ?? objects[index]
  const readout = !typed
    ? t.previewCycle.replace('{n}', pad(index + 1)).replace('{total}', pad(objects.length))
    : noMatch
      ? t.previewNone
      : t.previewMatches.replace('{count}', matches.length)

  return (
  <div
    className={`${styles.preview} ${noMatch ? styles.dim : ''}`}
    onMouseEnter={() => setHeld(true)}
    onMouseLeave={() => setHeld(false)}
    onFocus={() => setHeld(true)}
    onBlur={() => setHeld(false)}
  >
    <Link to={`/objects/${object.id}`} className={styles.tvLink}>
      <Screen frame="tv" className={styles.tv} contentClassName={styles.tvPicture}>
        <span className={styles.osd} aria-hidden="true">{readout}</span>
        <img
          key={object.id}
          className={styles.tvPhoto}
          src={`/images/${object.image}`}
          alt={object.alt}
          decoding="async"
        />
      </Screen>
      <span className={styles.caption}>
        <DymoLabel className={styles.accession}>{object.accession}</DymoLabel>
        <span className={styles.name}>{object.name}</span>
        <span className={styles.meta}>
          <span>{object.yearLabel}</span>
          <span className={styles.metaRule} aria-hidden="true" />
          <span>{object.category}</span>
        </span>
      </span>
    </Link>
  </div>
)
}