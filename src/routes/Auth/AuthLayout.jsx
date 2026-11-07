import { Backdrop } from '../../components/Backdrop/Backdrop.jsx'
import { Screen, ScreenLine, Cursor } from '../../components/Screen/Screen.jsx'
import { DymoLabel } from '../../components/DymoLabel/DymoLabel.jsx'
import { Screw } from '../../components/Screw/Screw.jsx'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { en } from '../../content/en.js'
import styles from './Auth.module.css'

// The frame shared by sign in, register and reset: a narrow terminal with a
// CRT banner on top and a plain putty form panel below.
// Every auth page says plainly that the sign-in is simulated.
export function AuthLayout({ title, prompt, children, footer }) {
  usePageTitle(title)
  return (
    <div className={styles.room} data-room="dark">
      <Backdrop />
      <div className={styles.terminal}>
        <Screen className={styles.screen} label={en.auth.screenTitle}>
          <ScreenLine size="sm" dim>
            {en.auth.screenTitle.toUpperCase()}
          </ScreenLine>
          <ScreenLine size="lg">
            {prompt}
            <Cursor />
          </ScreenLine>
        </Screen>

        <div className={styles.panel} data-room="light">
          <Screw className={styles.screwL} angle={20} />
          <Screw className={styles.screwR} angle={-35} />
          <div className={styles.panelHead}>
            <DymoLabel tone="signal">{en.auth.simulated}</DymoLabel>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.note}>{en.auth.simulatedNote}</p>
          </div>
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}
