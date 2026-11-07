import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { mission } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Closing.module.css'

const t = en.home

// The mission statement, then the closing line and one last invitation.
export function Closing() {
  return (
    <>
      <section className={styles.mission} aria-labelledby="mission-title">
        <h2 id="mission-title" className={styles.missionTitle}>
          {t.mission.title}
        </h2>
        <p className={styles.missionText}>{mission}</p>
      </section>

      <section className={styles.closing} data-room="dark" aria-labelledby="closing-title">
        <Backdrop />
        <div className={styles.closingInner}>
          <h2 id="closing-title" className={styles.line}>
            {t.closing.line}
          </h2>
          <TransportKey to="/archive" variant="signal" icon="play" size="lg">
            {t.closing.cta}
          </TransportKey>
        </div>
      </section>
    </>
  )
}
