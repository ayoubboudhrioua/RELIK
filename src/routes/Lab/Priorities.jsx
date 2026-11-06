import { Switch } from '../../components/Switch/Switch.jsx'
import { FUTURES, rankFutures } from '../../lab/model.js'
import { labOutcomes } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Lab.module.css'

const t = en.lab

// Step D: choose a priority, and compare how every future ranks under each one.
export function Priorities({ values, priority, onChange }) {
  // One ranking per priority, looked up by future id.
  const table = Object.fromEntries(
    t.priorities.map((p) => [p.id, Object.fromEntries(rankFutures(values, p.id).map((f) => [f.id, f]))]),
  )

  return (
    <div className={styles.priorities}>
      <fieldset className={styles.priorityGroup}>
        <legend className={styles.priorityLegend}>{t.priorityLabel}</legend>
        <p className={styles.priorityHint}>{t.priorityHint}</p>
        <div className={styles.prioritySwitches}>
          {t.priorities.map((p) => (
            <Switch
              key={p.id}
              type="radio"
              name="lab-priority"
              label={p.label}
              checked={priority === p.id}
              onChange={() => onChange(p.id)}
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.tableCaption}>{t.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.futureHeader}</th>
              {t.priorities.map((p) => (
                <th key={p.id} scope="col" data-current={priority === p.id || undefined}>
                  {p.label}
                  {priority === p.id && <span className="visually-hidden"> ({t.currentPriority})</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUTURES.map((id) => (
              <tr key={id}>
                <th scope="row">{labOutcomes.find((o) => o.id === id).name}</th>
                {t.priorities.map((p) => {
                  const future = table[p.id][id]
                  return (
                    <td key={p.id} data-current={priority === p.id || undefined} data-top={future.rank === 1 || undefined}>
                      <span className={styles.cellRank}>#{future.rank}</span> {t.fit[future.fit]}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
