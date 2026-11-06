import styles from './Styleguide.module.css'

// Lays out one component in several states, each under a small mono caption.
// items: an array of [caption, element] pairs.
export function StateGrid({ items, wide = false }) {
  return (
    <ul role="list" className={`${styles.stateGrid} ${wide ? styles.stateGridWide : ''}`}>
      {items.map(([caption, element]) => (
        <li key={caption} className={styles.stateCell}>
          <span className={styles.stateCaption}>{caption}</span>
          {element}
        </li>
      ))}
    </ul>
  )
}
