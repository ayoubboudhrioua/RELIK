import { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion.js'
import { readStorage, writeStorage } from '../services/storage.js'

const STORAGE_KEY = 'relik:crt'
const CrtContext = createContext({ crtOn: false, setCrtOn: () => {} })

// Holds the footer switch "CRT effects: on/off".
// Default: on, unless the visitor prefers reduced motion.
// The choice is saved in localStorage and mirrored on <html data-crt="on|off">
// so plain CSS can show or hide scanlines and glow.
export function CrtEffectsProvider({ children }) {
  const reducedMotion = useReducedMotion()
  const [crtOn, setCrtOn] = useState(() => {
    const saved = readStorage(STORAGE_KEY, null)
    if (saved === 'on' || saved === 'off') return saved === 'on'
    return !reducedMotion
  })

  useEffect(() => {
    document.documentElement.dataset.crt = crtOn ? 'on' : 'off'
  }, [crtOn])

  function changeCrt(next) {
    setCrtOn(next)
    writeStorage(STORAGE_KEY, next ? 'on' : 'off')
  }

  return (
    <CrtContext.Provider value={{ crtOn, setCrtOn: changeCrt }}>
      {children}
    </CrtContext.Provider>
  )
}

export function useCrtEffects() {
  return useContext(CrtContext)
}
