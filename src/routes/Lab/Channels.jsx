import { LedMeter } from '../../components/LedMeter/LedMeter.jsx'
import { FUTURES } from '../../lab/model.js'
import { labOutcomes } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Lab.module.css'

// The patch bay is drawn on a fixed grid of 7 equal columns (100 units each):
// column 0 holds the device's Out jack, columns 1–6 the six channels.
// The CSS grid below uses the same 7 columns, so cables always meet their jacks.
const COLUMN = 100
const JACK_Y = 22
const jackX = (column) => column * COLUMN + COLUMN / 2

function cablePath(toColumn) {
  const x0 = jackX(0)
  const x1 = jackX(toColumn)
  const sag = 26 + toColumn * 9 // longer cables hang lower
  return `M ${x0} ${JACK_Y} C ${x0 + (x1 - x0) / 3} ${JACK_Y + sag}, ${x1 - (x1 - x0) / 3} ${JACK_Y + sag}, ${x1} ${JACK_Y}`
}

// Step C: six channel strips. Each shows its LED meter, fit word and rank.
// - ranked: the model's output, best first
// - device: the chosen preset's object (shown in the Out module)
// - compact: phones, where the futures show as a ranked list without cables
export function Channels({ ranked, device, compact }) {
  const byId = Object.fromEntries(ranked.map((future) => [future.id, future]))
  const name = (id) => labOutcomes.find((o) => o.id === id).name
  const fit = (future) => en.lab.fit[future.fit]

  if (compact) {
    return (
      <ol className={styles.futureList} aria-label={en.lab.channelsLabel}>
        {ranked.map((future) => (
          <li key={future.id}>
            <LedMeter
              rank={future.rank}
              label={name(future.id)}
              fit={fit(future)}
              lit={future.segments}
              highlight={future.rank === 1}
            />
          </li>
        ))}
      </ol>
    )
  }

  // Draw the #1 cable last so it sits on top of the others.
  const order = [...FUTURES].sort((a, b) => (byId[a].rank === 1) - (byId[b].rank === 1))

  return (
    <div className={styles.console}>
      <svg className={styles.cables} viewBox="0 0 700 90" preserveAspectRatio="none" aria-hidden="true">
        {order.map((id) => {
          const column = FUTURES.indexOf(id) + 1
          const top = byId[id].rank === 1
          return (
            <path
              key={id}
              d={cablePath(column)}
              className={top ? styles.cableTop : styles.cable}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>

      {/* Jacks: one per column, at the same height as the cable ends. */}
      {Array.from({ length: 7 }, (_, column) => (
        <span
          key={column}
          className={styles.jack}
          data-top={column > 0 && byId[FUTURES[column - 1]].rank === 1 ? true : undefined}
          style={{ left: `calc(${((column + 0.5) / 7) * 100}% - 8px)` }}
          aria-hidden="true"
        />
      ))}

      <div className={styles.outModule}>
        <img src={`/images/${device.image}`} alt="" className={styles.outThumb} />
        <span className={styles.outLabel}>{en.lab.outJack}</span>
      </div>

      <ul role="list" className={styles.channels} aria-label={en.lab.channelsLabel}>
        {FUTURES.map((id) => {
          const future = byId[id]
          return (
            <li key={id} className={styles.channel} data-top={future.rank === 1 || undefined}>
              <LedMeter
                orientation="vertical"
                label={name(id)}
                fit={fit(future)}
                lit={future.segments}
                highlight={future.rank === 1}
              />
              <span className={styles.rank}>#{future.rank}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
