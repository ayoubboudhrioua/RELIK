import { usePageTitle } from '../../hooks/usePageTitle.js'
import { photoCredits } from '../../data/credits.js'
import { en } from '../../content/en.js'
import styles from './Credits.module.css'

const t = en.credits

// The acquisition register: every photograph on RELIK with its author,
// licence and source page on Wikimedia Commons.
export function Credits() {
  usePageTitle(t.pageTitle)
  const h = t.headers

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t.title}</h1>
      <p className={styles.intro}>{t.intro}</p>

      <div className={styles.wrap}>
        <table className={styles.table}>
          <caption className="visually-hidden">{t.title}</caption>
          <thead>
            <tr>
              <th scope="col">{h.photo}</th>
              <th scope="col">{h.subject}</th>
              <th scope="col">{h.author}</th>
              <th scope="col">{h.licence}</th>
              <th scope="col">{h.source}</th>
            </tr>
          </thead>
          <tbody>
            {photoCredits.map((credit) => (
              <tr key={credit.file}>
                <td data-label={h.photo}>
                  <span className={styles.thumb}>
                    <img src={`/images/${credit.file}`} alt={en.objectAlt[credit.file]} loading="lazy" />
                  </span>
                </td>
                <th scope="row" data-label={h.subject}>
                  {credit.subject}
                </th>
                <td data-label={h.author}>{credit.author}</td>
                <td data-label={h.licence}>
                  {credit.licenceUrl ? (
                    <a href={credit.licenceUrl} target="_blank" rel="noreferrer">
                      {credit.licence}
                    </a>
                  ) : (
                    credit.licence
                  )}
                </td>
                <td data-label={h.source}>
                  <a href={credit.source} target="_blank" rel="noreferrer" aria-label={`${t.viewSource}: ${credit.subject}`}>
                    {t.viewSource}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
