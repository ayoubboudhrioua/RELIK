import styles from './Screen.module.css'

// A CRT or VFD screen set in a bezel.
// - tone: 'amber' (CRT phosphor) or 'vfd' (cyan-green vacuum fluorescent display)
// - state: 'on' | 'off' | 'loading' | 'error'
// - live: true when the content changes and should be announced (aria-live)
// - label: an accessible name, e.g. "Archive search screen"
// - backdrop: an optional decorative layer drawn behind the text
// - powerOn: play the power-on reveal (a bright line opening into the picture)
// - contentClassName: extra class for the content area (to lay out its children)
// Scanlines and glow appear only when CRT effects are on (see useCrtEffects).
export function Screen({
  tone = 'amber',
  state = 'on',
  live = false,
  label,
  backdrop,
  powerOn = false,
  contentClassName = '',
  children,
  className = '',
  ...rest
}) {
  const liveProps = live ? { role: 'status', 'aria-live': 'polite' } : {}

  return (
    <div
      className={`${styles.bezel} ${className}`}
      data-tone={tone}
      data-state={state}
      data-power-on={powerOn || undefined}
      aria-label={label}
      role={label && !live ? 'group' : undefined}
      {...rest}
    >
      <div className={styles.glass}>
        {backdrop}
        <div className={`${styles.content} ${contentClassName}`} {...liveProps} aria-busy={state === 'loading' || undefined}>
          {state === 'off' ? <span className="visually-hidden">Screen off</span> : children}
        </div>
        <span className={styles.scanlines} aria-hidden="true" />
        <span className={styles.reflection} aria-hidden="true" />
      </div>
    </div>
  )
}

// A block cursor that blinks once per second (well under the 3 Hz limit).
export function Cursor() {
  return <span className={styles.cursor} aria-hidden="true" />
}

// A line of large screen text in VT323 (always 20px or more).
export function ScreenLine({ children, size = 'md', dim = false, as: Tag = 'p' }) {
  return (
    <Tag className={`${styles.line} ${styles[size] ?? ''} ${dim ? styles.dim : ''}`}>{children}</Tag>
  )
}
