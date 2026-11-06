import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

gsap.registerPlugin(ScrollTrigger)

// Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger
// animations and the scroll position always agree.
// With reduced motion, Lenis is not used: the browser scrolls normally.
export function SmoothScroll({ children }) {
  const reducedMotion = useReducedMotion()
  const lenisRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    // GSAP calls this on every frame; it moves Lenis forward.
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    )
  }

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.12 }}>
      <LenisSync />
      {children}
    </ReactLenis>
  )
}

// Inside Lenis: tell ScrollTrigger about every scroll, and start each page at the top.
function LenisSync() {
  const { pathname } = useLocation()
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])

  return null
}

// Without Lenis: start each page at the top.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
