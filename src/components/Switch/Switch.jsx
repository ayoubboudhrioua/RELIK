import { useId } from 'react'
import styles from './Switch.module.css'

// A hardware slide switch. Underneath it is a real checkbox (or radio),
// so keyboard, screen readers and forms work as usual.
// The state shows three ways: knob position, a lit LED, and the checked state.
// - type: 'checkbox' (default) or 'radio'
// - count: optional number shown at the end (e.g. results per filter)
// - description: optional helper text, linked with aria-describedby
export function Switch({
  type = 'checkbox',
  label,
  description,
  count,
  checked,
  defaultChecked,
  onChange,
  name,
  value,
  disabled = false,
  className = '',
  ...rest
}) {
  const id = useId()
  const descriptionId = description ? `${id}-desc` : undefined

  return (
    <label
      className={`${styles.switch} ${className}`}
      data-disabled={disabled || undefined}
      data-count={count !== undefined || undefined}
      {...rest}
    >
      <input
        className={styles.input}
        type={type}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={descriptionId}
      />
      <span className={styles.housing} aria-hidden="true">
        <span className={styles.knob} />
      </span>
      <span className={styles.led} aria-hidden="true" />
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </label>
  )
}
