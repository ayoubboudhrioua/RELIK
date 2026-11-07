import { useRef, useState } from 'react'
import { LedMeter } from '../../components/LedMeter/LedMeter.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap.js'
import { en } from '../../content/en.js'
import styles from './Hero.module.css'

const t = en.home.hero
const REST = { left: 6, right: 5 } // lit segments when the page is still
const TOP_SPEED = 4000 // px per second that lights the meters fully

// The L/R level meters on the hero console. They kick up with the scroll
// speed and fall back when the page stops: the one playful touch of the site.
// Purely decorative (hidden from screen readers); still with reduced motion.
export function VuMeters() {
  const reducedMotion = useReducedMotion()
  const ref = useRef(null)
  const [lit, setLit] = useState(REST)

  useGSAP(
    () => {
      if (reducedMotion) return
      const level = { ...REST }
      const show = () =>
        setLit((previous) => {
          const next = { left: Math.round(level.left), right: Math.round(level.right) }
          return next.left === previous.left && next.right === previous.right ? previous : next
        })
      let fallBack = null

      // Listens only while the hero is on screen.
      ScrollTrigger.create({
        trigger: ref.current.closest('[data-room]'),
        start: 'top bottom',
        end: 'bottom top',
        onUpdate(self) {
          const speed = Math.min(Math.abs(self.getVelocity()), TOP_SPEED) / TOP_SPEED
          fallBack?.kill()
          gsap.to(level, {
            left: Math.min(10, REST.left + speed * 4),
            right: Math.min(10, REST.right + speed * 5),
            duration: 0.12,
            overwrite: true,
            onUpdate: show,
          })
          fallBack = gsap.to(level, { ...REST, duration: 0.8, delay: 0.18, ease: 'power2.out', onUpdate: show })
        },
      })
    },
    { scope: ref, dependencies: [reducedMotion] },
  )

  return (
    <div ref={ref} className={styles.vu} aria-hidden="true">
      <span className={styles.vuLabel}>{t.vuLeft}</span>
      <LedMeter decorative lit={lit.left} />
      <span className={styles.vuLabel}>{t.vuRight}</span>
      <LedMeter decorative lit={lit.right} />
    </div>
  )
}
