import { useEffect, useRef } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { gsap, ScrollTrigger } from './gsap.js'

// The one place where Lenis (smooth scrolling) and GSAP are connected:
// - GSAP's ticker drives Lenis, frame by frame (lagSmoothing off, so they never drift);
// - every Lenis scroll updates ScrollTrigger (see LenisSync);
// - ScrollTrigger measures again once the fonts and images have loaded.
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

  useRefreshWhenLoaded()

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

// Fonts and late images change the page's height: measure the triggers again.
function useRefreshWhenLoaded() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    return () => window.removeEventListener('load', refresh)
  }, [])
}

// Without Lenis: start each page at the top.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
