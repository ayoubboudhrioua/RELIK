import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { walkmanStory } from '../../data/objects.js'
import { en } from '../../content/en.js'
import { StoryChapter } from './StoryChapter.jsx'
import { REST_POINTS, SEGMENTS, useStoryMotion } from './useStoryMotion.js'
import styles from './WalkmanStory.module.css'

const t = en.home.story
const LAST = walkmanStory.length - 1 // 3
const COUNTER_END = 900 // the tape counter runs 0000 → 0900 over the story

// "A story worth preserving": the four Walkman chapters played as tape tracks.
// - Wide screens with motion allowed ('pinned'): the deck is pinned and the
//   scroll plays the tape (see useStoryMotion).
// - Phones and tablets ('stacked'): the chapters stack, each with its own
//   entrance, and the transport bar sticks to the bottom of the section.
// - Reduced motion ('static'): the stacked layout, with nothing moving.
export function WalkmanStory() {
  const reducedMotion = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 640px)')
  const mode = reducedMotion ? 'static' : wide ? 'pinned' : 'stacked'

  const [active, setActive] = useState(0)
  const [count, setCount] = useState(0)
  const sectionRef = useRef(null)
  const reelsRef = useRef({ reels: [], packs: [] })
  const triggerRef = useRef(null)
  const lenis = useLenis()

  // Pinned: the scroll progress picks the chapter and rolls the counter.
  const onProgress = useCallback((progress) => {
    setActive(Math.min(LAST, Math.floor(progress * SEGMENTS)))
    setCount(Math.round(progress * COUNTER_END))
  }, [])

  useStoryMotion({ sectionRef, reelsRef, triggerRef, mode, onProgress })

  // Stacked and static: the chapter in the middle of the screen is active.
  useEffect(() => {
    if (mode === 'pinned') return
    const chapters = sectionRef.current.querySelectorAll('[data-chapter]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number(entry.target.dataset.chapter)
          setActive(index)
          setCount(Math.round((index / LAST) * COUNTER_END))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [mode])

  // Track keys scroll to their chapter; they never swap the content directly.
  function playTrack(index) {
    const trigger = triggerRef.current
    let top
    if (mode === 'pinned' && trigger) {
      top = trigger.start + (trigger.end - trigger.start) * REST_POINTS[index]
    } else {
      const chapter = sectionRef.current.querySelector(`[data-chapter="${index}"]`)
      // The static layout keeps its transport bar sticky at the top: leave room for it.
      const bar = mode === 'static' ? sectionRef.current.querySelector('[data-transport]')?.offsetHeight ?? 0 : 0
      top = chapter.getBoundingClientRect().top + window.scrollY - bar - 16
      setActive(index)
    }
    if (lenis) lenis.scrollTo(top, { duration: 1.2, force: true })
    else window.scrollTo({ top })
  }

  const modeClass = mode === 'pinned' ? styles.pinned : `${styles.stacked} ${mode === 'stacked' ? styles.barBottom : ''}`

  return (
    <section ref={sectionRef} className={`${styles.room} ${modeClass}`} data-room="dark" aria-labelledby="story-title">
      <Backdrop />
      <div className={styles.stage}>
        <header className={styles.header}>
          <h2 id="story-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.intro}>{t.intro}</p>
        </header>

        <div className={styles.transport} data-transport="">
          <Reels refs={reelsRef} showPacks={mode === 'pinned'} />
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
            <StoryChapter key={chapter.chapter} chapter={chapter} index={index} active={active === index} />
          ))}
        </ol>
      </div>
    </section>
  )
}

// Two cassette reels seen through the deck's window. When the story is pinned,
// a tape pack (the brown disc) shrinks on the left and grows on the right.
function Reels({ refs, showPacks }) {
  return (
    <svg className={styles.reels} viewBox="0 0 160 64" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="158" height="62" rx="6" className={styles.cassette} />
      <rect x="22" y="14" width="116" height="36" rx="18" className={styles.cassetteWindow} />
      <path d="M48 46 H112" className={styles.tape} />
      {[48, 112].map((cx, i) => (
        <g key={cx} transform={`translate(${cx} 32)`}>
          {showPacks && <circle r="17" className={styles.pack} ref={(el) => (refs.current.packs[i] = el)} />}
          <g ref={(el) => (refs.current.reels[i] = el)}>
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
