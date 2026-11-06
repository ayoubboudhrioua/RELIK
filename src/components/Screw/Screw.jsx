import styles from './Screw.module.css'

// A slotted panel screw. Pure decoration: hidden from assistive technology.
// `angle` turns the slot so the four screws of a faceplate don't look copied.
export function Screw({ angle = 0, className = '' }) {
  return (
    <span className={`${styles.screw} ${className}`} aria-hidden="true">
      <span className={styles.slot} style={{ transform: `rotate(${angle}deg)` }} />
    </span>
  )
}
