import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { LedMeter } from '../../components/LedMeter/LedMeter.jsx'
import { rankFutures, FUTURES } from '../../lab/model.js'
import { labPresets, labOutcomes } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './LabTeaser.module.css'

const t = en.home.labTeaser

// Decision Lab teaser: a six-channel mixing console.
// The meters are the real Lab model's output for the Walkman preset.
export function LabTeaser() {
  const preset = labPresets.find((p) => p.objectId === 'walkman-tps-l2')
  const [f, R, U, C] = preset.values
  const ranked = rankFutures({ f, R, U, C }, 'balanced')
  const byId = Object.fromEntries(ranked.map((future) => [future.id, future]))

  return (
    <section className={styles.room} data-room="dark" aria-labelledby="lab-teaser-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="lab-teaser-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.text}>{t.text}</p>
          <TransportKey to="/lab" variant="signal" icon="record" className={styles.cta}>
            {t.cta}
          </TransportKey>
        </div>

        <figure className={styles.console}>
          <figcaption className={styles.preset}>
            <span>{t.presetLabel}</span>
            <span className={styles.note}>{t.note}</span>
          </figcaption>
          <ul role="list" className={styles.channels} aria-label={t.futuresLabel}>
            {FUTURES.map((id) => {
              const future = byId[id]
              const outcome = labOutcomes.find((o) => o.id === id)
              return (
                <li key={id} className={styles.channel}>
                  <LedMeter
                    orientation="vertical"
                    label={outcome.name}
                    fit={en.lab.fit[future.fit]}
                    lit={future.segments}
                    highlight={future.rank === 1}
                  />
                  <span className={styles.rank}>#{future.rank}</span>
                </li>
              )
            })}
          </ul>
        </figure>
      </div>
    </section>
  )
}
