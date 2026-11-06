import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../Icon/Icon.jsx'
import { en } from '../../content/en.js'
import styles from './Nav.module.css'

// The site header: a rack unit with the logotype, the main links and the
// session state. On narrow screens the links move into a full-screen menu
// built on <dialog>, which traps focus and closes with Escape.
// - user: null when signed out, or { name } when signed in (simulated)
// - onSignOut: called by the Sign out button
export function Nav({ user = null, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef(null)
  const t = en.nav

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) dialog.showModal()
    if (!menuOpen && dialog.open) dialog.close()
  }, [menuOpen])

  const links = t.links.map((link) => (
    <li key={link.to}>
      <NavLink to={link.to} className={styles.link} onClick={() => setMenuOpen(false)}>
        <span className={styles.led} aria-hidden="true" />
        {link.label}
      </NavLink>
    </li>
  ))

  const session = user ? (
    <div className={styles.sessionGroup}>
      <Link to="/collection" className={styles.session} onClick={() => setMenuOpen(false)}>
        <span className={styles.sessionLabel}>{t.signedInAs}</span> {user.name}
      </Link>
      <button
        type="button"
        className={styles.signOut}
        onClick={() => {
          setMenuOpen(false)
          onSignOut?.()
        }}
      >
        {t.signOut}
      </button>
    </div>
  ) : (
    <Link to="/signin" className={styles.signIn} onClick={() => setMenuOpen(false)}>
      {t.signIn}
    </Link>
  )

  return (
    <header className={styles.header} data-room="dark">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label={t.home}>
          <span className={styles.power} aria-hidden="true" />
          <span className={styles.wordmark} aria-hidden="true">
            {en.site.name}
          </span>
          <span className={styles.plate} aria-hidden="true">
            {t.plate}
          </span>
        </Link>

        <nav aria-label={t.label} className={styles.desktopNav}>
          <ul role="list" className={styles.links}>
            {links}
          </ul>
        </nav>

        <div className={styles.desktopSession}>{session}</div>

        <button
          type="button"
          className={styles.menuButton}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Icon name="menu" size={22} />
          <span className="visually-hidden">{t.openMenu}</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.menu}
        data-room="dark"
        aria-label={t.label}
        onClose={() => setMenuOpen(false)}
      >
        <div className={styles.menuTop}>
          <span className={styles.wordmark} aria-hidden="true">
            {en.site.name}
          </span>
          <button type="button" className={styles.menuButton} onClick={() => setMenuOpen(false)} autoFocus>
            <Icon name="close" size={22} />
            <span className="visually-hidden">{t.closeMenu}</span>
          </button>
        </div>
        <nav aria-label={t.label}>
          <ul role="list" className={styles.menuLinks}>
            {links}
          </ul>
        </nav>
        <div className={styles.menuSession}>{session}</div>
      </dialog>
    </header>
  )
}
