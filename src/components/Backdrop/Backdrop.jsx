import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useCrtEffects } from '../../hooks/useCrtEffects.jsx'
import { addBackdropLayer } from '../../motion/backdrop.js'
import styles from './Backdrop.module.css'

// The animated background of the dark rooms: a slow amber phosphor glow
// with faint scanlines and grain.
//
// How it works: put <Backdrop /> as the FIRST child of a dark room. It draws a
// window the size of the room; inside it, the scene is `position: fixed`, so
// every room on the page looks into the same scene, as if one layer sat
// behind the whole site. Light (putty) rooms never show it.
//
// It is decoration only: hidden from screen readers, and switched off with
// reduced motion or when the footer switch "CRT effects" is off (that switch
// is also how a visitor stops the moving background).
export function Backdrop() {
  const reducedMotion = useReducedMotion()
  const { crtOn } = useCrtEffects()
  const shiftRef = useRef(null)
  const visible = crtOn && !reducedMotion

  useEffect(() => {
    if (!visible || !shiftRef.current) return
    return addBackdropLayer(shiftRef.current)
  }, [visible])

  if (!visible) return null

  return (
    <div className={styles.window} data-backdrop="" aria-hidden="true">
      <div className={styles.scene}>
        <div ref={shiftRef} className={styles.shift}>
          <div className={styles.glow} />
        </div>
        <div className={styles.scanlines} />
        <div className={styles.grain} />
      </div>
    </div>
  )
}
