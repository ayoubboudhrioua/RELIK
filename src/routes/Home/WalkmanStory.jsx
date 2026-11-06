import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { walkmanStory } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './WalkmanStory.module.css'

gsap.registerPlugin(ScrollTrigger)

const t = en.home.story
const LAST = walkmanStory.length - 1 // 3
const COUNTER_LENGTH = 900 // the tape counter runs 0000 → 0900 over the story

// "A story worth preserving": the four Walkman chapters played as tape tracks.
// - Wide screens with motion allowed: the deck is pinned and scrolling scrubs the tape.
// - Phones or reduced motion: the chapters stack, with sticky track keys on top.
export function WalkmanStory() {
  const reducedMotion = useReducedMotion()
  const wide = useMediaQuery('(min-width: 821px)')
  const pinned = wide && !reducedMotion

  const [active, setActive] = useState(0)
  const [count, setCount] = useState(0)
  const sectionRef = useRef(null)
  const reelsRef = useRef([])
  const triggerRef = useRef(null)
  const lenis = useLenis()

  // Pinned mode: one ScrollTrigger drives the chapter, the counter and the reels.
  useGSAP(
    () => {
      if (!pinned) return
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * LAST}`,
        pin: true,
        scrub: true,
        snap: { snapTo: 1 / LAST, duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' },
        onUpdate(self) {
          setActive(Math.round(self.progress * LAST))
          setCount(Math.round(self.progress * COUNTER_LENGTH))
          gsap.set(reelsRef.current, { rotation: self.progress * 1080, transformOrigin: '50% 50%' })
        },
      })
      triggerRef.current = trigger
      return () => {
        triggerRef.current = null
      }
    },
    { dependencies: [pinned], scope: sectionRef, revertOnUpdate: true },
  )

  // Stacked mode: the chapter in the middle of the screen becomes active.
  useEffect(() => {
    if (pinned) return
    const chapters = sectionRef.current.querySelectorAll('[data-chapter]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.chapter)
            setActive(index)
            setCount(Math.round((index / LAST) * COUNTER_LENGTH))
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [pinned])

  // Track keys: jump to a chapter without scrolling by hand.
  function playTrack(index) {
    const trigger = triggerRef.current
    if (pinned && trigger) {
      const y = trigger.start + ((trigger.end - trigger.start) * index) / LAST
      if (lenis) lenis.scrollTo(y, { duration: 1.1 })
      else window.scrollTo({ top: y })
      return
    }
    // Stacked mode: scroll so the chapter sits just under the sticky track keys.
    const chapter = sectionRef.current.querySelector(`[data-chapter="${index}"]`)
    const barHeight = sectionRef.current.querySelector('[data-transport]')?.offsetHeight ?? 0
    const top = chapter.getBoundingClientRect().top + window.scrollY - barHeight - 16
    if (lenis) lenis.scrollTo(top, { duration: 0.9, force: true })
    else window.scrollTo({ top })
    setActive(index)
  }

  return (
    <section
      ref={sectionRef}
      className={`${styles.room} ${pinned ? styles.pinned : styles.stacked}`}
      data-room="dark"
      aria-labelledby="story-title"
    >
      <div className={styles.stage}>
        <header className={styles.header}>
          <h2 id="story-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.intro}>{t.intro}</p>
        </header>

        <div className={styles.transport} data-transport>
          <Reels refs={reelsRef} />
          <div className={styles.tracks} role="group" aria-label={t.tracksLabel}>
            {walkmanStory.map((chapter, index) => (
              <TransportKey
                key={chapter.chapter}
                variant="graphite"
                icon="play"
                current={active === index}
                onClick={() => playTrack(index)}
                className={styles.trackKey}
              >
                <span className={styles.trackShort}>{t.trackShort[index]}</span>
                <span className={styles.trackPhase}>{chapter.phase}</span>
              </TransportKey>
            ))}
          </div>
          <p className={styles.nowPlaying} aria-hidden="true">
            {t.trackShort[active]} {walkmanStory[active].phase}
          </p>
          <TapeCounter value={count} label={t.counterLabel} className={styles.counter} />
        </div>

        <ol role="list" className={styles.chapters}>
          {walkmanStory.map((chapter, index) => (
            <li
              key={chapter.chapter}
              data-chapter={index}
              className={styles.chapter}
              data-active={active === index || undefined}
            >
              <div className={styles.text}>
                <p className={styles.track}>
                  {index < 2 ? t.sideA : t.sideB}, {chapter.track.split('·')[1].trim()}
                </p>
                <p className={styles.phase}>
                  <span>{chapter.phase}</span>
                  <span className={styles.rule} aria-hidden="true" />
                  <span>{chapter.years}</span>
                </p>
                <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                <p className={styles.body}>{chapter.text}</p>
              </div>

              <figure className={styles.figure}>
                <div className={styles.window}>
                  {t.photos[index].map((src) => (
                    <img
                      key={src}
                      src={`/images/${src}`}
                      alt={en.objectAlt[src]}
                      loading="lazy"
                      decoding="async"
                      className={src.startsWith('photographs/') ? styles.photo : styles.cutout}
                    />
                  ))}
                </div>
                <ul role="list" className={styles.notes}>
                  {t.annotations[index].map((note, i) => (
                    <li key={note}>
                      <DymoLabel tilt={i % 2 ? 1 : -1}>{note}</DymoLabel>
                    </li>
                  ))}
                </ul>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// Two cassette reels seen through the deck's window. They turn as the tape plays.
function Reels({ refs }) {
  return (
    <svg className={styles.reels} viewBox="0 0 160 64" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="158" height="62" rx="6" className={styles.cassette} />
      <rect x="22" y="14" width="116" height="36" rx="18" className={styles.cassetteWindow} />
      <path d="M48 46 H112" className={styles.tape} />
      {[48, 112].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} 32)`}>
          <g ref={(el) => (refs.current[i] = el)}>
            <circle r="13" className={styles.reel} />
            <circle r="4" className={styles.hub} />
            {[0, 120, 240].map((a) => (
              <rect key={a} x="-1.5" y="-12" width="3" height="7" rx="1" transform={`rotate(${a})`} className={styles.spoke} />
            ))}
          </g>
        </g>
      ))}
    </svg>
  )
}
