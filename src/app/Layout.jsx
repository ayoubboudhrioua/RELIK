import { Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Nav } from '../components/Nav/Nav.jsx'
import { Footer } from '../components/Footer/Footer.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../components/Toast/Toast.jsx'
import { en } from '../content/en.js'

// The frame shared by every page: skip link, header, main content, footer.
export function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  async function handleSignOut() {
    await signOut()
    showToast(en.auth.signedOutToast)
    navigate('/')
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {en.site.skipLink}
      </a>
      <Nav user={user} onSignOut={handleSignOut} />
      <main id="main" tabIndex={-1}>
        {/* While a page's code loads, the nav and footer stay in place. */}
        {/* A full screen of space keeps the footer from jumping into view. */}
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
