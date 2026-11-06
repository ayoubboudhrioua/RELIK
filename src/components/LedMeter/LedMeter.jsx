import styles from './LedMeter.module.css'

const SEGMENTS = 10

// A segmented LED meter, like the level meters on a mixing desk.
// The meaning is always carried by words (the fit word and the rank),
// never by the lit colour: the segments are decorative and hidden
// from screen readers.
// - lit: how many of the 10 segments are lit (0–10)
// - label: what is measured, e.g. "Preserve"
// - fit: the fit word, e.g. "Strong fit"
// - rank: optional rank number (1 = best)
// - highlight: true for the top-ranked meter (its segments use the signal colour)
// - decorative: true for purely visual meters (e.g. hero VU meters)
export function LedMeter({
  lit,
  label,
  fit,
  rank,
  highlight = false,
  orientation = 'horizontal',
  decorative = false,
  className = '',
}) {
  const segments = Array.from({ length: SEGMENTS }, (_, i) => i < lit)

  const bar = (
    <span className={styles.segments} aria-hidden="true">
      {segments.map((on, i) => (
        <span
          key={i}
          className={styles.segment}
          data-on={on || undefined}
          style={{ '--i': i }}
        />
      ))}
    </span>
  )

  if (decorative) {
    return (
      <span className={`${styles.meter} ${styles[orientation] ?? ''} ${styles.decorative} ${className}`} aria-hidden="true">
        {bar}
      </span>
    )
  }

  return (
    <div
      className={`${styles.meter} ${styles[orientation] ?? ''} ${className}`}
      data-highlight={highlight || undefined}
    >
      {rank !== undefined && <span className={styles.rank}>#{rank}</span>}
      <span className={styles.label}>{label}</span>
      {bar}
      <span className={styles.fit}>{fit}</span>
    </div>
  )
}
