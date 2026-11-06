import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Panel } from '../../components/Panel/Panel.jsx'
import { Screen, ScreenLine, Cursor } from '../../components/Screen/Screen.jsx'
import { SpecimenBay } from '../../components/SpecimenBay/SpecimenBay.jsx'
import { LedMeter } from '../../components/LedMeter/LedMeter.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { DecodeText } from '../../components/DecodeText/DecodeText.jsx'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { getObject, objects } from '../../data/objects.js'
import { en } from '../../content/en.js'
import styles from './Hero.module.css'

const t = en.home.hero
const BOOT_KEY = 'relik:booted'
// Boot timing: the screen powers on (300 ms), then 4 lines appear 220 ms
// apart, each decoding into place: about 1.18 s, under the 1.2 s limit.
const POWER_ON = 300
const LINE_DELAY = 220

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

// The first screen: a graphite archive console the visitor can operate.
// The CRT boots, settles on READY, and holds a real archive search.
export function Hero() {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const walkman = getObject('walkman-tps-l2')
  const lines = t.bootLines.map((line) => line.replace('{count}', objects.length))

  const [booted, setBooted] = useState(() => reducedMotion || alreadyBooted())
  // The power-on reveal plays only on the first visit of the session.
  const [poweringOn] = useState(() => !booted)
  const [shownLines, setShownLines] = useState(booted ? lines.length : 0)
  const [query, setQuery] = useState('')

  function finishBoot() {
    setShownLines(lines.length)
    setBooted(true)
    rememberBoot()
  }

  useEffect(() => {
    if (booted) return
    let count = 0
    let timer = 0
    const start = setTimeout(() => {
      timer = setInterval(() => {
        count += 1
        setShownLines(count)
        if (count >= lines.length) {
          clearInterval(timer)
          setBooted(true)
          rememberBoot()
        }
      }, LINE_DELAY)
    }, POWER_ON)
    // Any key press skips the start-up too.
    const skip = () => {
      clearTimeout(start)
      clearInterval(timer)
      setShownLines(lines.length)
      setBooted(true)
      rememberBoot()
    }
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      clearTimeout(start)
      clearInterval(timer)
      window.removeEventListener('keydown', skip)
    }
  }, [booted, lines.length])

  function search(event) {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/archive?q=${encodeURIComponent(q)}` : '/archive')
  }

  return (
    <div className={styles.room} data-room="dark">
      <Panel tone="graphite" className={styles.console} aria-labelledby="hero-title" plate={t.consolePlate}>
        {/* DOM order = reading and focus order on phones: screen, headline,
            actions, then the specimen. The grid puts the bay top-right on desktop. */}
        <div className={styles.grid}>
          <Screen
            className={styles.screen}
            label={t.screenLabel}
            state={booted ? 'on' : 'loading'}
            powerOn={poweringOn}
            contentClassName={styles.screenContent}
          >
            <div className={styles.readout} aria-hidden={!booted || undefined}>
              {lines.slice(0, shownLines).map((line, i) => {
                const isLast = i === lines.length - 1
                return (
                  <ScreenLine key={line} as="div" size={isLast ? 'lg' : 'sm'} dim={!isLast}>
                    {/* Lines typed during the boot decode in; on later visits they are plain. */}
                    {poweringOn ? <DecodeText text={(isLast ? '> ' : '') + line} duration={0.5} /> : (isLast ? '> ' : '') + line}
                    {isLast && booted && <Cursor />}
                  </ScreenLine>
                )
              })}
            </div>

            <form role="search" className={styles.search} onSubmit={search}>
              <label htmlFor="hero-search" className={styles.searchLabel}>
                {en.archive.searchPrompt}
              </label>
              <div className={styles.searchRow}>
                <input
                  id="hero-search"
                  type="search"
                  className={styles.searchInput}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={en.archive.searchPlaceholder}
                  autoComplete="off"
                />
                <button type="submit" className={styles.searchButton}>
                  {t.searchSubmit}
                </button>
              </div>
              <p className={styles.suggestions}>
                <span className={styles.suggestionsLabel}>{t.searchTry}</span>
                {en.archive.emptySuggestions.map((word) => (
                  <Link key={word} to={`/archive?q=${encodeURIComponent(word)}`} className={styles.suggestion}>
                    {word}
                  </Link>
                ))}
              </p>
            </form>

            {!booted && (
              <button type="button" className={styles.skip} onClick={finishBoot}>
                {t.skipBoot}
              </button>
            )}
          </Screen>

          <h1 id="hero-title" className={styles.headline}>
            <span className={styles.line}>{t.headline[0]}</span>
            <span className={styles.line}>{t.headline[1]}</span>
          </h1>

          <div className={styles.controls}>
            <p className={styles.lead}>{t.lead}</p>
            <div className={styles.keys}>
              <TransportKey to="/archive" variant="signal" icon="play" size="lg">
                {t.ctaArchive}
              </TransportKey>
              <TransportKey to="/lab" variant="graphite" icon="record" size="lg">
                {t.ctaLab}
              </TransportKey>
            </div>
            <div className={styles.deck}>
              <TapeCounter value={objects.length} label={t.counterLabel} />
              <div className={styles.vu} aria-hidden="true">
                <span className={styles.vuLabel}>{t.vuLeft}</span>
                <LedMeter decorative lit={6} />
                <span className={styles.vuLabel}>{t.vuRight}</span>
                <LedMeter decorative lit={5} />
              </div>
            </div>
          </div>

          <div className={styles.bench}>
            <SpecimenBay
              object={walkman}
              to={`/objects/${walkman.id}`}
              tone="graphite"
              size="l"
              showStory={false}
              headingAs="p"
              priority
              className={styles.bay}
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}
