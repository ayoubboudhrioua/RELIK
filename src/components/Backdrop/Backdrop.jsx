import { memo, useEffect, useRef, useState } from 'react'
import CRTWarp from '../ReactBits/CRTWarp/CRTWarp.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useCrtEffects } from '../../hooks/useCrtEffects.jsx'
import { VhsOsd } from './VhsOsd.jsx'
import styles from './Backdrop.module.css'

// The background of the dark rooms: a barely-there amber CRT picture
// (React Bits CRTWarp) with a faint VCR date and time in the bottom corners.
// It is meant to be noticed only when you look for it.
//
// How it works: put <Backdrop /> as the FIRST child of a dark room. It draws a
// window the size of the room; inside it, the scene is `position: fixed`, so
// every room on the page looks into the same screen. Light (putty) rooms never
// show it.
//
// The one interaction: the picture bends gently around the pointer, like a
// magnet near a tube, in the room under the pointer only.
//
// It is decoration only: hidden from screen readers, and switched off with
// reduced motion or when the footer switch "CRT effects" is off (that switch
// is also how a visitor stops the moving background).

// memo: the picture only re-renders when one of its settings really changes.
const Crt = memo(CRTWarp)

// The look of the picture: slow, soft and quiet.
// To make it louder again, raise noise, flicker, interference and rgbShift,
// or set changeOnClick to true for the channel change (roll, tear, static).
const LOOK = {
  color: '#ffb000', // --amber
  backgroundColor: 'transparent', // the room's own graphite shows through
  mask: 'slot',
  maskStrength: 0.25,
  curvature: 0.12,
  persistence: 0.6,
  speed: 0.15,
  waveAmplitude: 0.35,
  waveFrequency: 2.5,
  levels: 4,
  columns: 96,
  scanlineStrength: 0.5,
  scanlineFrequency: 260,
  bloom: 1,
  bloomRadius: 1.2,
  rgbShift: 0.0015,
  noise: 0.05,
  flicker: 0.05,
  interference: 0.05,
  vignette: 0.45,
  brightness: 1,
  intro: false,
  mouseStrength: 0.35,
  changeOnClick: false,
  dpr: 1.5,
  fps: 30,
}

export function Backdrop() {
  const reducedMotion = useReducedMotion()
  const { crtOn } = useCrtEffects()
  if (!crtOn || reducedMotion) return null
  return <BackdropWindow />
}

function BackdropWindow() {
  const windowRef = useRef(null)
  const sceneRef = useRef(null)
  const [onScreen, setOnScreen] = useState(false)
  const [woken, setWoken] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const win = windowRef.current
    const room = win.parentElement

    // The picture is only drawn while its room is on screen, and is created
    // the first time the room scrolls into view.
    // A room that only touches the screen edge still counts as off screen,
    // hence the ratio check and the second threshold.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0
        setOnScreen(visible)
        if (visible) setWoken(true)
      },
      { threshold: [0, 0.01] },
    )
    observer.observe(win)

    // Only the room under the pointer reacts to it.
    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    room.addEventListener('pointerenter', enter)
    room.addEventListener('pointerleave', leave)

    return () => {
      observer.disconnect()
      room.removeEventListener('pointerenter', enter)
      room.removeEventListener('pointerleave', leave)
    }
  }, [])

  // The date and time hug the part of the room that is on screen, so they
  // never hide under the nav or past the room's edge. Measured every frame
  // while the room is visible and written straight to CSS variables
  // (no React re-render).
  useEffect(() => {
    if (!onScreen) return
    const win = windowRef.current
    const scene = sceneRef.current
    let frame = 0
    let last = ''
    const fit = () => {
      frame = requestAnimationFrame(fit)
      const box = win.getBoundingClientRect()
      const { clientWidth, clientHeight } = document.documentElement
      const top = Math.max(0, Math.round(box.top))
      const right = Math.max(0, Math.round(clientWidth - box.right))
      const bottom = Math.max(0, Math.round(clientHeight - box.bottom))
      const left = Math.max(0, Math.round(box.left))
      const key = `${top} ${right} ${bottom} ${left}`
      if (key === last) return
      last = key
      scene.style.setProperty('--room-top', `${top}px`)
      scene.style.setProperty('--room-right', `${right}px`)
      scene.style.setProperty('--room-bottom', `${bottom}px`)
      scene.style.setProperty('--room-left', `${left}px`)
    }
    fit()
    return () => cancelAnimationFrame(frame)
  }, [onScreen])

  return (
    <div ref={windowRef} className={styles.window} data-backdrop="" aria-hidden="true">
      <div ref={sceneRef} className={styles.scene}>
        <div className={styles.glow} />
        {woken && <Crt {...LOOK} className={styles.crt} mouseReact={hovered} paused={!onScreen} />}
        <VhsOsd />
      </div>
    </div>
  )
}