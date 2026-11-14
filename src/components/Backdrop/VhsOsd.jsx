import { useVhs } from '../../motion/vhs.js'
import styles from './Backdrop.module.css'

// A faint VCR date and time stamp in the bottom corners of the dark rooms.
// Decoration only: it sits inside the backdrop, which is aria-hidden.
export function VhsOsd() {
  const { clock, date } = useVhs()

  return (
    <div className={styles.osd}>
      <span className={styles.date}>{date}</span>
      <span className={styles.clock}>{clock}</span>
    </div>
  )
}