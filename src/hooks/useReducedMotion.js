import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Returns true when the visitor asked the system for less motion.
// Every animation in RELIK checks this hook before it runs.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(QUERY).matches
      : false,
  )

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
