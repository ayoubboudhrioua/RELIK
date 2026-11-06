import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion.js'

// Plays a reveal the first time an element scrolls into view.
// Returns 'none' | 'pending' | 'play' for a data attribute in CSS.
// - Elements already on screen when the page loads are never hidden.
// - With reduced motion, nothing is hidden and nothing plays.
// - If JavaScript fails, the default ('none') shows the content.
export function useRevealOnce(ref) {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState('none')

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion || !('IntersectionObserver' in window)) return

    const box = element.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return // already visible

    setState('pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setState('play')
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, reducedMotion])

  return state
}
