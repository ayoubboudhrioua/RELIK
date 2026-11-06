import { Link } from 'react-router-dom'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { en } from '../../content/en.js'
import { format, countText } from '../../content/format.js'
import styles from './ArchiveIndex.module.css'

const t = en.archive

// "Index" display: the archive as a card-catalogue ledger, one row per object.
// The small photo carries data-flip-id so it can morph from the gallery bay.
export function ArchiveIndex({ objects, onQuickLook }) {
  const h = t.indexHeaders
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{countText(t.indexCaption, objects.length)}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.photoCol}>
              <span className="visually-hidden">{h.photo}</span>
            </th>
            <th scope="col">{h.accession}</th>
            <th scope="col">{h.name}</th>
            <th scope="col" className={styles.hideNarrow}>{h.maker}</th>
            <th scope="col">{h.year}</th>
            <th scope="col" className={styles.hideNarrow}>{h.category}</th>
            <th scope="col">
              <span className="visually-hidden">{h.look}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {objects.map((object) => (
            <tr key={object.id}>
              <td className={styles.photoCol}>
                <span className={styles.thumb}>
                  <img src={`/images/${object.image}`} alt="" data-flip-id={object.id} loading="lazy" />
                </span>
              </td>
              <td>
                <DymoLabel className={styles.dymo}>{object.accession}</DymoLabel>
              </td>
              <th scope="row" className={styles.name}>
                <Link to={`/objects/${object.id}`}>{object.name}</Link>
              </th>
              <td className={styles.hideNarrow}>{object.maker}</td>
              <td className={styles.mono}>{object.yearLabel}</td>
              <td className={styles.hideNarrow}>{object.category}</td>
              <td className={styles.lookCol}>
                <button
                  type="button"
                  className={styles.look}
                  onClick={() => onQuickLook(object)}
                  aria-label={format(t.quickLookFor, { name: object.name })}
                >
                  {t.quickLook}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
