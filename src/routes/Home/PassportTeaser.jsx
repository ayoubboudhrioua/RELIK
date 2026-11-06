import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { getObject, getPassport } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './PassportTeaser.module.css'

const t = en.home.passportTeaser

// Device Passport teaser, laid out like an open service manual:
// a figure on the left page, a specification sheet on the right.
export function PassportTeaser() {
  const walkman = getObject('walkman-tps-l2')
  const passport = getPassport('walkman-tps-l2')
  const specs = passport.specifications.filter(([label]) => t.specRows.includes(label))

  return (
    <section className={styles.room} aria-labelledby="passport-teaser-title">
      <div className={styles.spread}>
        <figure className={styles.leftPage}>
          <div className={styles.plate}>
            <img
              src={`/images/${walkman.altImage}`}
              alt={walkman.altImageAlt}
              loading="lazy"
              decoding="async"
              className={styles.figureImage}
            />
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.fig}>{t.figure}</span>
            <span>{walkman.name}</span>
            <DymoLabel>{walkman.accession}</DymoLabel>
          </figcaption>
        </figure>

        <div className={styles.rightPage}>
          <h2 id="passport-teaser-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.text}>{t.text}</p>

          <h3 className={styles.sheetTitle}>{t.sheetTitle}</h3>
          <dl className={styles.sheet}>
            {specs.map(([label, value]) => (
              <div key={label} className={styles.row}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className={styles.sheetTitle}>{t.sectionsTitle}</h3>
          <ul role="list" className={styles.fields}>
            {t.fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>

          <TransportKey to={`/objects/${walkman.id}`} icon="play" className={styles.cta}>
            {t.cta}
          </TransportKey>
        </div>
      </div>
    </section>
  )
}
