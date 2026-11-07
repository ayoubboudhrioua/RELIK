import { useEffect, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../motion/gsap.js'
import { useFontsReady } from '../../motion/useFontsReady.js'

// The four chapters share the pinned scroll in four equal segments.
// A chapter is "at rest" in the middle of its segment; those are the snap
// points and the places the track keys scroll to.
export const SEGMENTS = 4
export const REST_POINTS = [0.125, 0.375, 0.625, 0.875]
const COUNTER_END = 900 // the tape counter runs 0000 → 0900 over the story
const REEL_TURNS = 1440 // degrees each reel turns over the whole story

// The parts of one chapter that move (marked with data attributes in StoryChapter).
function partsOf(chapter) {
  return {
    chapter,
    window: chapter.querySelector('[data-window]'),
    eyebrow: chapter.querySelector('[data-eyebrow]'),
    title: chapter.querySelector('[data-title]'),
    fades: [...chapter.querySelectorAll('[data-fade]')],
    labels: [...chapter.querySelectorAll('[data-label]')],
  }
}

// A chapter comes on: the photo powers on like a CRT, the track eyebrow types
// in, the headline lines rise from behind a mask, the text fades up, and the
// Dymo labels stamp down one by one. Durations are in timeline units.
// `splits` collects the SplitText objects so they can be undone on cleanup.
function chapterIn(parts, splits) {
  const eyebrow = SplitText.create(parts.eyebrow, { type: 'chars', aria: 'none' }) // already aria-hidden
  const title = SplitText.create(parts.title, { type: 'lines', mask: 'lines' })
  splits.push(eyebrow, title)
  return gsap
    .timeline()
    .fromTo(
      parts.window,
      { scaleY: 0.02, opacity: 0, filter: 'brightness(2.4)' },
      { scaleY: 1, opacity: 1, filter: 'brightness(1)', duration: 0.28, ease: 'power3.out' },
      0,
    )
    .fromTo(eyebrow.chars, { opacity: 0 }, { opacity: 1, duration: 0.001, stagger: 0.012 }, 0)
    .fromTo(title.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.3, stagger: 0.07, ease: 'power3.out' }, 0.05)
    .fromTo(parts.fades, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.15)
    .fromTo(
      parts.labels,
      { opacity: 0, scale: 1.4 },
      { opacity: 1, scale: 1, duration: 0.18, stagger: 0.08, ease: 'back.out(3)' },
      0.2,
    )
}

// A chapter goes off: the photo collapses to a bright line (a CRT wipe)
// and the words fade.
function chapterOut(parts) {
  return gsap
    .timeline()
    .to(parts.window, { scaleY: 0.02, filter: 'brightness(2.4)', duration: 0.16, ease: 'power2.in' }, 0)
    .to(parts.window, { opacity: 0, duration: 0.05 }, 0.14)
    .to([parts.eyebrow, parts.title, ...parts.fades, ...parts.labels], { opacity: 0, duration: 0.15 }, 0)
}

// The reels: the left one slows down as the right one speeds up, and the
// tape pack moves from the left reel to the right one.
function spinReels(reels, progress) {
  const [left, right] = reels.reels
  const [leftPack, rightPack] = reels.packs
  if (!left || !right || !leftPack || !rightPack) return
  const p = progress
  gsap.set(left, { rotation: REEL_TURNS * (p - 0.3 * p * p), transformOrigin: '50% 50%' })
  gsap.set(right, { rotation: REEL_TURNS * (0.4 * p + 0.3 * p * p), transformOrigin: '50% 50%' })
  gsap.set(leftPack, { scale: 1 - 0.4 * p, transformOrigin: '50% 50%' })
  gsap.set(rightPack, { scale: 0.6 + 0.4 * p, transformOrigin: '50% 50%' })
}

// Bumps a number when the window width changes, so the story is rebuilt
// (the headline lines are measured again).
function useWidthVersion() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    let width = window.innerWidth
    let timer = 0
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.innerWidth === width) return
        width = window.innerWidth
        setVersion((v) => v + 1)
      }, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return version
}

// All the motion of the Walkman story.
// - mode 'pinned': one master timeline, pinned for 4 screen heights and
//   scrubbed by the scroll, with snapping to each chapter.
// - mode 'stacked': each chapter plays its entrance once when it scrolls in.
// - mode 'static' (reduced motion): nothing moves.
// onProgress(progress) reports the pinned progress (0–1) to the component,
// and triggerRef.current holds the pinned ScrollTrigger (for the track keys).
export function useStoryMotion({ sectionRef, reelsRef, triggerRef, mode, onProgress }) {
  const fontsReady = useFontsReady()
  const widthVersion = useWidthVersion()

  useGSAP(
    () => {
      if (mode === 'static' || !fontsReady) return
      const section = sectionRef.current
      const parts = [...section.querySelectorAll('[data-chapter]')].map(partsOf)
      // useGSAP undoes tweens and triggers, but not SplitText's wrappers.
      const splits = []
      const undoSplits = () => splits.forEach((split) => split.revert())

      if (mode === 'stacked') {
        for (const chapter of parts) {
          const entrance = chapterIn(chapter, splits).pause().timeScale(0.6)
          ScrollTrigger.create({
            trigger: chapter.chapter,
            start: 'top 80%',
            once: true,
            onEnter: () => entrance.play(),
          })
        }
        return undoSplits
      }

      // Pinned: chapter i is on screen from i to i + 1 on the timeline.
      // Inline start values, so the timeline never depends on React's data-active.
      gsap.set(parts.map((c) => c.chapter), { opacity: (i) => (i === 0 ? 1 : 0) })
      const master = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * SEGMENTS}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: [0, ...REST_POINTS, 1],
            duration: { min: 0.3, max: 0.9 },
            delay: 0.15,
            ease: 'power2.inOut',
          },
          onUpdate(self) {
            spinReels(reelsRef.current, self.progress)
            onProgress(self.progress)
          },
        },
      })

      for (let i = 1; i < parts.length; i++) {
        const at = i // the chapter change happens at the segment boundary
        master
          .add(chapterOut(parts[i - 1]), at - 0.25)
          .set(parts[i - 1].chapter, { opacity: 0 }, at)
          .set(parts[i].chapter, { opacity: 1 }, at - 0.05)
          .add(chapterIn(parts[i], splits), at - 0.05)
      }
      // The last chapter keeps its own segment before the pin releases.
      master.set({}, {}, SEGMENTS)

      triggerRef.current = master.scrollTrigger
      spinReels(reelsRef.current, 0)
      return () => {
        triggerRef.current = null
        undoSplits()
      }
    },
    { scope: sectionRef, dependencies: [mode, fontsReady, widthVersion], revertOnUpdate: true },
  )
}
