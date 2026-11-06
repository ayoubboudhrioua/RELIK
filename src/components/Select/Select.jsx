import { useId } from 'react'
import styles from './Select.module.css'

// A labelled native <select>, styled like a rotary selector's window.
// options: [{ id, label }]
export function Select({ label, options, value, onChange, id: givenId, className = '', ...rest }) {
  const autoId = useId()
  const id = givenId ?? autoId
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.wrap}>
        <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true" />
      </div>
    </div>
  )
}
