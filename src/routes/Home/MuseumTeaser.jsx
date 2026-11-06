import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { getObject, sampleCollection } from '../../data/objects.js'
import { STATUSES } from '../../services/collection.js'
import { en } from '../../content/en.js'
import styles from './MuseumTeaser.module.css'

const t = en.home.museumTeaser

// J-card styles for the six spines. The order is mixed on purpose so that
// colour never lines up with a status (colour carries no meaning here).
const SPINE_STYLES = ['graphite', 'signal', 'paper', 'graphite', 'paper', 'signal']

// "Your personal museum": the sample collection as cassette spines in a rack.
export function MuseumTeaser() {
  // Statuses outside the collection's list (e.g. "Saved just now") show as "Stored",
  // the same way the collection service files them.
  const spines = sampleCollection.map((entry) => ({
    ...entry,
    status: STATUSES.includes(entry.status) ? entry.status : 'Stored',
    object: getObject(entry.objectId),
  }))

  return (
    <section className={styles.room} aria-labelledby="museum-teaser-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="museum-teaser-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.text}>{t.text}</p>
          <TransportKey to="/collection" icon="record" className={styles.cta}>
            {t.cta}
          </TransportKey>
        </div>

        <figure className={styles.rack}>
          <figcaption className={styles.rackLabel}>
            {t.rackLabel}
            <DymoLabel tone="signal">{en.common.sample}</DymoLabel>
          </figcaption>
          <ul role="list" className={styles.spines}>
            {spines.map(({ object, status }, index) => (
              <li key={object.id} className={styles.spine} data-style={SPINE_STYLES[index % SPINE_STYLES.length]}>
                <span className={styles.band} aria-hidden="true" />
                <span className={styles.name}>{object.name}</span>
                <span className={styles.year}>{object.yearLabel}</span>
                <span className={styles.status}>{status}</span>
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  )
}
