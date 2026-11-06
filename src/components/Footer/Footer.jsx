import { Link } from 'react-router-dom'
import { Switch } from '../Switch/Switch.jsx'
import { Screw } from '../Screw/Screw.jsx'
import { useCrtEffects } from '../../hooks/useCrtEffects.jsx'
import { en } from '../../content/en.js'
import styles from './Footer.module.css'

// The bottom rack unit: links, credits, course details and the
// "CRT effects: on/off" switch (scanlines and screen glow).
export function Footer() {
  const { crtOn, setCrtOn } = useCrtEffects()
  const t = en.footer

  return (
    <footer className={styles.footer} data-room="dark">
      <div className={styles.inner}>
        <Screw className={styles.screwL} angle={30} />
        <Screw className={styles.screwR} angle={-15} />

        <div className={styles.brand}>
          <p className={styles.wordmark}>{en.site.name}</p>
          <p className={styles.tagline}>{t.tagline}</p>
        </div>

        <nav aria-label={t.label} className={styles.nav}>
          <ul role="list" className={styles.links}>
            {t.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.crt}>
          <Switch
            label={`${en.crt.label}: ${crtOn ? en.crt.on : en.crt.off}`}
            description={en.crt.hint}
            checked={crtOn}
            onChange={(event) => setCrtOn(event.target.checked)}
          />
        </div>

        <div className={styles.small}>
          <p>{t.sampleNote}</p>
          <p>{t.course}</p>
        </div>
      </div>
    </footer>
  )
}
