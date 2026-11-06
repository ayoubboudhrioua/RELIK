import { useId } from 'react'
import { Icon } from '../Icon/Icon.jsx'
import { en } from '../../content/en.js'
import styles from './Field.module.css'

// A labelled text field with optional hint and error.
// The label is always visible; hint and error are linked with aria-describedby.
// Errors start with the word "Error" and an icon, so they never rely on colour.
// Pass `as="textarea"` for multi-line text. Other props go to the input.
export function Field({
  label,
  hint,
  error,
  as: Control = 'input',
  type = 'text',
  id: givenId,
  className = '',
  ...rest
}) {
  // Pass `id` when an error summary needs to link to this field.
  const autoId = useId()
  const id = givenId ?? autoId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`${styles.field} ${className}`} data-invalid={error ? true : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <Control
        id={id}
        className={styles.control}
        type={Control === 'input' ? type : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          <Icon name="alert" size={18} />
          <span>
            <span className={styles.errorWord}>{en.common.error}:</span> {error}
          </span>
        </p>
      )}
    </div>
  )
}
