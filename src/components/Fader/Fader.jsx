import { useId } from 'react'
import styles from './Fader.module.css'

// A mixing-desk fader. Underneath it is a native <input type="range">,
// so arrow keys, Home/End, touch and screen readers all work.
// Values run from 1 to 5; `words` gives the word for each level
// (e.g. Dead, Barely, Partly, Mostly, Fully). The word is announced
// through aria-valuetext and shown on the small VFD readout.
// - orientation: 'vertical' (mixing desk) or 'horizontal' (narrow screens)
export function Fader({
  label,
  words,
  value,
  onChange,
  orientation = 'vertical',
  disabled = false,
  className = '',
  ...rest
}) {
  const id = useId()
  const word = words[value - 1]

  return (
    <div
      className={`${styles.fader} ${styles[orientation] ?? ''} ${className}`}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <p className={styles.readout} aria-hidden="true">
        {word}
      </p>

      <div className={styles.bed}>
        <ol className={styles.scale} aria-hidden="true">
          {words.map((w, i) => (
            <li key={w} className={i + 1 === value ? styles.current : undefined}>
              <span className={styles.tick} />
              <span className={styles.word}>{w}</span>
            </li>
          ))}
        </ol>

        <div className={styles.slot}>
          <input
            id={id}
            className={styles.input}
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            aria-valuetext={word}
            disabled={disabled}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
