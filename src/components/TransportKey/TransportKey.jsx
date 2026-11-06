import { Link } from 'react-router-dom'
import { Icon } from '../Icon/Icon.jsx'
import styles from './TransportKey.module.css'

// A cassette-deck transport key: the main action button of RELIK.
// It renders a <Link> when `to` is given, otherwise a <button>.
// - icon: 'play' | 'record' | 'stop' | 'forward' | 'rewind' | 'eject' | ...
// - variant: 'putty' | 'graphite' | 'signal' (signal = the one primary action)
// - pressed: for toggle keys (sets aria-pressed and keeps the key down)
// - current: for keys that pick one step of a sequence (sets aria-current="step")
// - loading: shows a turning reel and `loadingLabel`
// - size: 'sm' | 'md' | 'lg' (sm keeps a 44px target)
// data-demo (used only on /styleguide) freezes a state for display.
export function TransportKey({
  to,
  icon,
  variant = 'putty',
  size = 'md',
  pressed,
  current = false,
  loading = false,
  loadingLabel,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const classes = `${styles.key} ${styles[variant] ?? ''} ${styles[size] ?? ''} ${className}`
  const content = (
    <>
      <span className={styles.led} aria-hidden="true" />
      <span className={styles.legend}>
        {loading ? <Icon name="reel" className={styles.reel} /> : icon && <Icon name={icon} />}
      </span>
      <span className={styles.label}>{loading && loadingLabel ? loadingLabel : children}</span>
    </>
  )

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={pressed}
      aria-current={current ? 'step' : undefined}
      aria-busy={loading || undefined}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  )
}
