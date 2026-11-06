import styles from './DymoLabel.module.css'

// Embossed label tape: black tape, raised white letters.
// Used for accession numbers (RLK·1979·001) and short tags such as "Sample".
// - tone: 'black' (default) or 'signal' (orange tape, for the Sample tag)
// - tilt: a small rotation in degrees, as if stuck on by hand
export function DymoLabel({ children, tone = 'black', tilt = 0, className = '', ...rest }) {
  return (
    <span
      className={`${styles.tape} ${styles[tone] ?? ''} ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      {...rest}
    >
      {children}
    </span>
  )
}
