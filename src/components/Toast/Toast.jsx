import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon.jsx'
import styles from './Toast.module.css'

const ToastContext = createContext(() => {})
const VISIBLE_MS = 4500

// Short confirmations such as "Saved to your collection."
// The message lives in an aria-live region, so screen readers hear it too.
// Usage: const showToast = useToast(); showToast('Saved to your collection.')
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const show = useCallback((message) => {
    clearTimeout(timer.current)
    setToast({ message, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), VISIBLE_MS)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toast && (
          <p key={toast.key} className={styles.toast} data-room="dark">
            <span className={styles.led} aria-hidden="true" />
            <Icon name="check" size={18} />
            <span>{toast.message}</span>
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
