import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import styles from './TapeCounter.module.css'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// A mechanical tape counter: digit wheels behind small windows.
// Each wheel rolls to its digit when the value changes.
// Screen readers get the plain number (and the optional label) instead of the wheels.
// The wheels wait at 0000 until the counter comes into view, then roll to the
// value like a mechanical counter (straight to the value with reduced motion).
// - value: the number to show
// - digits: how many wheels (4 by default, like a cassette deck)
// - label: optional caption printed under the windows, e.g. "Results"
export function TapeCounter({ value, digits = 4, label, size = 'md', className = '' }) {
  const ref = useRef(null)
  const inView = useSeenOnce(ref)
  const safe = Math.max(0, Math.floor(Number(value) || 0))
  const text = String(inView ? safe : 0).padStart(digits, '0').slice(-digits)

  return (
    <span ref={ref} className={`${styles.counter} ${styles[size] ?? ''} ${className}`}>
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

// True from the first time the element is on screen (always true with
// reduced motion, or in browsers without IntersectionObserver).
function useSeenOnce(ref) {
  const reducedMotion = useReducedMotion()
  const [seen, setSeen] = useState(() => reducedMotion || typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (seen || reducedMotion) {
      if (!seen) setSeen(true)
      return
    }
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      // One frame at 0000 first, so the wheels visibly roll.
      frame = requestAnimationFrame(() => setSeen(true))
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [ref, seen, reducedMotion])

  return seen
}
