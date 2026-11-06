import { useEffect, useId, useRef } from 'react'
import { Icon } from '../Icon/Icon.jsx'
import { Screw } from '../Screw/Screw.jsx'
import { en } from '../../content/en.js'
import styles from './Dialog.module.css'

// A modal panel built on the native <dialog> element, which traps focus,
// closes with Escape and returns focus to the button that opened it.
// - open / onClose: controlled by the parent
// - title: the dialog heading (also its accessible name)
// - size: 'md' | 'lg'
// - tone: 'putty' | 'graphite'
export function Dialog({ open, onClose, title, size = 'md', tone = 'putty', children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${styles[size] ?? ''}`}
      data-room={tone === 'graphite' ? 'dark' : undefined}
      data-tone={tone}
      aria-labelledby={open ? titleId : undefined}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop (outside the panel) closes the dialog.
        if (event.target === ref.current) onClose()
      }}
    >
      {open && (
        <div className={styles.panel}>
          <Screw className={styles.screwL} angle={25} />
          <Screw className={styles.screwR} angle={-30} />
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button type="button" className={styles.close} onClick={onClose}>
              <Icon name="close" size={22} />
              <span className="visually-hidden">{en.common.close}</span>
            </button>
          </header>
          <div className={styles.body}>{children}</div>
        </div>
      )}
    </dialog>
  )
}
