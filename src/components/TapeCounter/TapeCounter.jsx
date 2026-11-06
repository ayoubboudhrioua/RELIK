import styles from './TapeCounter.module.css'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// A mechanical tape counter: digit wheels behind small windows.
// Each wheel rolls to its digit when the value changes.
// Screen readers get the plain number (and the optional label) instead of the wheels.
// - value: the number to show
// - digits: how many wheels (4 by default, like a cassette deck)
// - label: optional caption printed under the windows, e.g. "Results"
export function TapeCounter({ value, digits = 4, label, size = 'md', className = '' }) {
  const safe = Math.max(0, Math.floor(Number(value) || 0))
  const text = String(safe).padStart(digits, '0').slice(-digits)

  return (
    <span className={`${styles.counter} ${styles[size] ?? ''} ${className}`}>
      <span className={styles.housing} aria-hidden="true">
        {text.split('').map((digit, i) => (
          <span key={i} className={styles.window}>
            <span className={styles.wheel} style={{ '--digit': Number(digit) }}>
              {DIGITS.map((d) => (
                <span key={d} className={styles.digit}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
      {label && (
        <span className={styles.caption} aria-hidden="true">
          {label}
        </span>
      )}
      <span className="visually-hidden">
        {label ? `${label}: ${safe}` : safe}
      </span>
    </span>
  )
}
