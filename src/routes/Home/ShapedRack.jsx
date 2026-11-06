import { SpecimenBay } from '../../components/SpecimenBay/SpecimenBay.jsx'
import { getObject } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './ShapedRack.module.css'

const t = en.home.shaped

// Two shelves of a museum rack. Each object gets a bay sized to the object
// (span = columns out of 12, size = bay height), not a uniform grid.
const SHELVES = [
  [
    { id: 'macintosh-classic', span: 5, size: 'l' },
    { id: 'game-boy', span: 3, size: 'l' },
    { id: 'digital-mavica-fd85', span: 4, size: 'm' },
  ],
  [
    { id: 'vhs-cassette', span: 5, size: 's' },
    { id: 'floppy-3-5', span: 3, size: 's' },
    { id: 'walkman-tps-l2', span: 4, size: 'm' },
  ],
]

export function ShapedRack() {
  return (
    <section className={styles.room} aria-labelledby="shaped-title">
      <header className={styles.header}>
        <h2 id="shaped-title" className={styles.title}>
          {t.title}
        </h2>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <div className={styles.rack}>
        {SHELVES.map((shelf, index) => (
          <div key={index} className={styles.shelf}>
            {shelf.map(({ id, span, size }) => {
              const object = getObject(id)
              return (
                <SpecimenBay
                  key={id}
                  object={object}
                  to={`/objects/${id}`}
                  size={size}
                  className={styles.slot}
                  style={{ '--span': span }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
