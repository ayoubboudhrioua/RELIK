import { Panel } from '../../components/Panel/Panel.jsx'
import { useState } from 'react'
import { HeroPreview } from './HeroPreview.jsx'
import { TransportKey } from '../../components/TransportKey/TransportKey.jsx'
import { TapeCounter } from '../../components/TapeCounter/TapeCounter.jsx'
import { objects } from '../../data/objects.js'
import { en } from '../../content/en.js'
import { HeroTerminal } from './HeroTerminal.jsx'
import { VuMeters } from './VuMeters.jsx'
import styles from './Hero.module.css'

const t = en.home.hero

// The first screen: a graphite archive console the visitor can operate.
// The terminal boots, settles on its status line, and holds a real archive search.
export function Hero() {
  const [query, setQuery] = useState('')

  return (
    <div className={styles.room} data-room="dark">
      <Panel tone="graphite" backdrop className={styles.console} aria-labelledby="hero-title" plate={t.consolePlate}>
        {/* DOM order = reading and focus order on phones: screen, headline,
            actions, then the specimen. The grid puts the bay top-right on desktop. */}
        <div className={styles.grid}>
          <HeroTerminal className={styles.screen} onQueryChange={setQuery} />

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
              <VuMeters />
            </div>
          </div>

          <div className={styles.bench}>
            <HeroPreview query={query} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
