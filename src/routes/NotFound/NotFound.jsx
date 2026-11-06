import { Link } from 'react-router-dom'
import { Panel } from '../../components/Panel/Panel.jsx'
import { Screen, ScreenLine, Cursor } from '../../components/Screen/Screen.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { en } from '../../content/en.js'
import styles from './NotFound.module.css'

// Shown for any address that is not a RELIK route.
export function NotFound() {
  const t = en.notFound
  usePageTitle(t.pageTitle)
  return (
    <div className={styles.page}>
      <Panel tone="graphite" title={t.title} titleAs="h1" titleId="page-title">
        <Screen className={styles.screen} label={t.title}>
          <ScreenLine>
            &gt; 404<Cursor />
          </ScreenLine>
        </Screen>
        <p className={styles.text}>{t.text}</p>
        <Link to="/" className={styles.link}>
          {t.cta}
        </Link>
      </Panel>
    </div>
  )
}
