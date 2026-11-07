import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { en } from '../../content/en.js'
import styles from './Logbook.module.css'

// One numbered section of the Logbook, like a chapter of a service manual.
// - id: anchor used by the contents list
// - number: the section number shown in the margin (the Logbook is a real sequence)
// - sample: true when the content is invented, adds a "Sample" tape
export function LogbookSection({ id, number, title, sample = false, children }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.sectionHead}>
        <span className={styles.sectionNumber} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <h2 id={`${id}-title`} className={styles.sectionTitle}>
          {title}
        </h2>
        {sample && <DymoLabel tone="signal">{en.common.sample}</DymoLabel>}
      </header>
      {children}
    </section>
  )
}
