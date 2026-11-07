import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Fader } from '../../components/Fader/Fader.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { rankFutures } from '../../lab/model.js'
import { labPresets, labOutcomes } from '../../data/objects.js'
import { en } from '../../content/en.js'
import { format } from '../../content/format.js'
import { DeviceRack } from './DeviceRack.jsx'
import { Channels } from './Channels.jsx'
import { Explanation } from './Explanation.jsx'
import { Priorities } from './Priorities.jsx'
import styles from './Lab.module.css'

const t = en.lab
const DEFAULT_PRESET = labPresets.find((p) => p.default) ?? labPresets[0]

function valuesOf(preset) {
  const [f, R, U, C] = preset.values
  return { f, R, U, C }
}

// The Decision Lab: pick a device, describe its condition with four faders,
// and compare six possible futures. All maths lives in lab/model.js.
export function Lab() {
  usePageTitle(t.pageTitle)
  const compact = useMediaQuery('(max-width: 820px)')
  // A Logbook can open the Lab on its own device: /lab?device=game-boy
  const [params] = useSearchParams()
  const startPreset = labPresets.find((p) => p.objectId === params.get('device')) ?? DEFAULT_PRESET

  const [deviceId, setDeviceId] = useState(startPreset.objectId)
  const [values, setValues] = useState(() => valuesOf(startPreset))
  const [priority, setPriority] = useState('balanced')
  const [announcement, setAnnouncement] = useState('')
  const [step, setStep] = useState(0) // phones only: 0 device, 1 condition, 2 futures, 3 priorities
  const stepHeading = useRef(null)

  const device = labPresets.find((p) => p.objectId === deviceId)
  const ranked = rankFutures(values, priority)
  const top = ranked[0]

  // Builds "Top future: Preserve, Strong fit." from a ranking.
  function topWords(list) {
    return { future: labOutcomes.find((o) => o.id === list[0].id).name, fit: t.fit[list[0].fit] }
  }

  function chooseDevice(id) {
    const preset = labPresets.find((p) => p.objectId === id)
    const next = valuesOf(preset)
    setDeviceId(id)
    setValues(next)
    setAnnouncement(format(t.deviceAnnounce, { name: preset.object.name, ...topWords(rankFutures(next, priority)) }))
  }

  function moveFader(input, value) {
    const next = { ...values, [input.id]: value }
    setValues(next)
    setAnnouncement(
      format(t.announce, { label: input.label, word: input.words[value - 1], ...topWords(rankFutures(next, priority)) }),
    )
  }

  function choosePriority(id) {
    setPriority(id)
    const label = t.priorities.find((p) => p.id === id).label
    setAnnouncement(format(t.priorityAnnounce, { priority: label, ...topWords(rankFutures(values, id)) }))
  }

  function reset() {
    const next = valuesOf(DEFAULT_PRESET)
    setDeviceId(DEFAULT_PRESET.objectId)
    setValues(next)
    setPriority('balanced')
    setStep(0)
    setAnnouncement(
      format(t.resetAnnounce, { name: DEFAULT_PRESET.object.name, ...topWords(rankFutures(next, 'balanced')) }),
    )
  }

  // Phones: after Back or Next, focus moves to the new step's heading so
  // keyboard and screen-reader users start reading at the right place.
  const focusStep = useRef(false)
  useEffect(() => {
    if (!focusStep.current) return
    focusStep.current = false
    const heading = stepHeading.current
    if (!heading) return
    heading.focus({ preventScroll: true })
    // Scroll so the new step starts just under the sticky step bar.
    const top = heading.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top: Math.max(0, top) })
  }, [step])

  function goToStep(next) {
    focusStep.current = true
    setStep(Math.min(3, Math.max(0, next)))
  }

  const stepTitles = [t.steps.device, t.steps.condition, t.steps.futures, t.steps.priorities]
  // On wide screens every step shows; on phones only the current one.
  const shows = (index) => !compact || step === index

  return (
    <div className={styles.page} data-room="dark">
      <Backdrop />
      {/* Phones after step 1: a slim header so each step starts near the top. */}
      <header className={`${styles.header} ${compact && step > 0 ? styles.headerSlim : ''}`}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.intro}>{t.intro}</p>
          <DymoLabel tone="signal">{t.disclaimer}</DymoLabel>
        </div>
        <div className={styles.headerTools}>
          <TransportKey icon="stop" onClick={reset}>
            {t.reset}
          </TransportKey>
        </div>
      </header>

      {/* "How this works": a full-width fold-out under the header. */}
      <details className={`${styles.how} ${compact && step > 0 ? styles.howHidden : ''}`}>
        <summary>{t.howTitle}</summary>
        <ul>
          {t.how.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      {compact && (
        <div className={styles.stepBar}>
          <p className={styles.stepCount}>{format(t.stepOf, { n: step + 1 })}</p>
          {step > 0 && (
            <button type="button" className={styles.stepReset} onClick={reset}>
              {t.reset}
            </button>
          )}
          <ol className={styles.stepDots} aria-hidden="true">
            {stepTitles.map((title, index) => (
              <li key={title} data-done={index < step || undefined} data-current={index === step || undefined} />
            ))}
          </ol>
        </div>
      )}

      <div className={styles.desk}>
        {shows(0) && (
          <section className={styles.stepA} aria-labelledby="step-a">
            <h2 id="step-a" className={styles.stepTitle} tabIndex={-1} ref={step === 0 ? stepHeading : null}>
              <span className={styles.stepLetter}>A</span> {t.steps.device}
            </h2>
            <DeviceRack deviceId={deviceId} onChange={chooseDevice} />
          </section>
        )}

        {shows(1) && (
          <section className={styles.stepB} aria-labelledby="step-b">
            <h2 id="step-b" className={styles.stepTitle} tabIndex={-1} ref={step === 1 ? stepHeading : null}>
              <span className={styles.stepLetter}>B</span> {t.steps.condition}
            </h2>
            <div className={styles.faders}>
              {t.inputs.map((input) => (
                <Fader
                  key={input.id}
                  label={input.label}
                  words={input.words}
                  value={values[input.id]}
                  onChange={(value) => moveFader(input, value)}
                  orientation={compact ? 'horizontal' : 'vertical'}
                />
              ))}
            </div>
          </section>
        )}

        {shows(2) && (
          <section className={styles.stepC} aria-labelledby="step-c">
            <h2 id="step-c" className={styles.stepTitle} tabIndex={-1} ref={step === 2 ? stepHeading : null}>
              <span className={styles.stepLetter}>C</span> {t.steps.futures}
            </h2>
            <Channels ranked={ranked} device={device.object} compact={compact} />
            <Explanation top={top} values={values} />
          </section>
        )}

        {shows(3) && (
          <section className={styles.stepD} aria-labelledby="step-d">
            <h2 id="step-d" className={styles.stepTitle} tabIndex={-1} ref={step === 3 ? stepHeading : null}>
              <span className={styles.stepLetter}>D</span> {t.steps.priorities}
            </h2>
            <Priorities values={values} priority={priority} onChange={choosePriority} />
          </section>
        )}
      </div>

      {compact && (
        <nav className={styles.stepNav} aria-label={format(t.stepOf, { n: step + 1 })}>
          <TransportKey icon="rewind" disabled={step === 0} onClick={() => goToStep(step - 1)}>
            {t.back}
          </TransportKey>
          <TransportKey
            variant="signal"
            icon="forward"
            disabled={step === 3}
            onClick={() => goToStep(step + 1)}
          >
            {t.next}
          </TransportKey>
        </nav>
      )}
    </div>
  )
}
