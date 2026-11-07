import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Cursor } from '../../components/Screen/Screen.jsx'
import { Icon } from '../../components/Icon/Icon.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { gsap, useGSAP } from '../../motion/gsap.js'
import { objects } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './HeroTerminal.module.css'


const t = en.home.hero
const BOOT_KEY = 'relik:booted'

// The boot sequence runs once per browser session.
function alreadyBooted() {
  try {
    return window.sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

function rememberBoot() {
  try {
    window.sessionStorage.setItem(BOOT_KEY, '1')
  } catch {
    // Storage unavailable: the boot simply runs again next time.
  }
}

// Lets a "A · B · C" readout wrap only after a middot, never inside a segment
// and never with a middot at the start of a line.
function keepSegmentsTogether(text) {
  return text
    .split(' · ')
    .map((segment) => segment.replace(/ /g, ' '))
    .join(' · ')
}

// Text split into one span per character, so the boot can "type" it.
// Screen readers get the plain text instead (see where it is used).
function Typed({ text }) {
  return [...text].map((char, i) => (
    <span key={i} data-char="">
      {char}
    </span>
  ))
}

// The archive terminal on the home page.
// First visit of the session (about 1.2 s, skippable): the CRT powers on,
// three log lines type in, then fold into one status line and the search appears.
// Later visits and reduced motion: the final state, with no animation.
export function HeroTerminal({ className = '', onQueryChange }) {
  
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const timeline = useRef(null)
  const [booted, setBooted] = useState(() => reducedMotion || alreadyBooted())
  const [query, setQuery] = useState('')

  const count = objects.length
  const logLines = t.bootLines.map((line) => line.replace('{count}', count))
  const status = keepSegmentsTogether(t.statusLine.replace('{count}', count))

  useGSAP(
    () => {
      if (booted) return
      const q = gsap.utils.selector(rootRef)
      const glass = q('[data-glass]')
      const finish = () => {
        rememberBoot()
        setBooted(true)
      }

      // Hidden before the first paint (useGSAP runs as a layout effect).
      gsap.set(q('[data-char]'), { opacity: 0 })
      gsap.set(q('[data-cursor]'), { opacity: 0 })
      gsap.set(q('[data-search]'), { opacity: 0, y: 8 })
      gsap.set(q('[data-beam]'), { opacity: 1, scaleX: 0, scaleY: 0.012 })

      const tl = gsap.timeline({ onComplete: finish })
      timeline.current = tl

      // 1. Power-on: a bright line widens, opens into the picture, with one soft flicker.
      tl.to(q('[data-beam]'), { scaleX: 1, duration: 0.12, ease: 'power2.out' })
        .to(q('[data-beam]'), { scaleY: 1, opacity: 0, duration: 0.26, ease: 'power3.out' })
        .to(glass, {
          keyframes: [
            { filter: 'brightness(1.5)', duration: 0.08 },
            { filter: 'brightness(0.9)', duration: 0.1 },
            { filter: 'brightness(1.1)', duration: 0.1 },
            { filter: 'brightness(1)', duration: 0.12 },
          ],
          clearProps: 'filter',
        }, '<')

      // 2. The log types in, one character at a time.
      // The first line starts while the beam is still fading.
      q('[data-log-line]').forEach((line, i) => {
        tl.to(line.querySelectorAll('[data-char]'), { opacity: 1, duration: 0.001, stagger: 0.006 }, i === 0 ? '-=0.1' : '+=0.03')
      })

      // 3. The log folds into a line and switches off; the status line types in.
      tl.to(q('[data-log]'), { scaleY: 0.04, filter: 'brightness(2)', duration: 0.12, ease: 'power2.in' }, '+=0.04')
        .to(q('[data-log]'), { opacity: 0, duration: 0.05 })
        .to(q('[data-status] [data-char]'), { opacity: 1, duration: 0.001, stagger: 0.003 })
        .to(q('[data-search]'), { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'all' }, '<-0.1')

      // Any key press skips to the end.
      const skip = () => tl.progress(1)
      window.addEventListener('keydown', skip, { once: true })
      return () => window.removeEventListener('keydown', skip)
    },
    { scope: rootRef, dependencies: [] },
  )

  function search(event) {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/archive?q=${encodeURIComponent(value)}` : '/archive')
  }

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`}>
      <Screen
        className={styles.screen}
        frame="tv"
        label={t.screenLabel}
        state={booted ? 'on' : 'loading'}
        contentClassName={styles.content}
        backdrop={!booted && <span className={styles.beam} data-beam="" aria-hidden="true" />}
      >
        <div className={styles.readout}>
          {!booted && (
            <div className={styles.log} data-log="" aria-hidden="true">
              {logLines.map((line) => (
                <div key={line} className={styles.logLine} data-log-line="">
                  <Typed text={line} />
                </div>
              ))}
            </div>
          )}
          <p className={styles.status} data-status="">
            {booted ? (
              status
            ) : (
              <>
                <span className="visually-hidden">{status}</span>
                <span aria-hidden="true">
                  <Typed text={status} />
                </span>
              </>
            )}
          </p>
        </div>

        <form role="search" className={styles.search} data-search="" onSubmit={search}>
          <label htmlFor="hero-search" className="visually-hidden">
            {t.searchLabel}
          </label>
          <div className={styles.field}>
            <span className={styles.prompt} aria-hidden="true">
              &gt;
            </span>
            <input
              id="hero-search"
              type="search"
              className={styles.input}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                onQueryChange?.(event.target.value)
              }}
              placeholder={en.archive.searchPlaceholder}
              autoComplete="off"
            />
            <button type="submit" className={styles.enter}>
              <span className={styles.keycap}>
                <Icon name="enter" size={18} />
                <span className={styles.enterWord}>{t.searchSubmit}</span>
                <span className="visually-hidden"> {t.searchHint}</span>
              </span>
            </button>
          </div>
        </form>

        {!booted && (
          <button type="button" className={styles.skip} onClick={() => timeline.current?.progress(1)}>
            {t.skipBoot}
          </button>
        )}
      </Screen>
    </div>
  )
}
