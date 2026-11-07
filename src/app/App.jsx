import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CrtEffectsProvider } from '../hooks/useCrtEffects.jsx'
import { AuthProvider } from '../hooks/useAuth.jsx'
import { CollectionProvider } from '../hooks/useCollection.jsx'
import { ToastProvider } from '../components/Toast/Toast.jsx'
import { SmoothScroll } from '../motion/SmoothScroll.jsx'
import { Layout } from './Layout.jsx'
import { Home } from '../routes/Home/Home.jsx'
import { Archive } from '../routes/Archive/Archive.jsx'
import { Lab } from '../routes/Lab/Lab.jsx'

// Home, Archive and Lab (the main journeys) load with the app, so they appear
// without a second download. The other pages load when first visited, which
// keeps the first download small. (lazy() needs a default-style import, so we
// pick the named export.)
const page = (load, name) => lazy(() => load().then((module) => ({ default: module[name] })))

const Logbook = page(() => import('../routes/Logbook/Logbook.jsx'), 'Logbook')
const Collection = page(() => import('../routes/Collection/Collection.jsx'), 'Collection')
const SignIn = page(() => import('../routes/Auth/SignIn.jsx'), 'SignIn')
const Register = page(() => import('../routes/Auth/Register.jsx'), 'Register')
const ResetPassword = page(() => import('../routes/Auth/ResetPassword.jsx'), 'ResetPassword')
const Credits = page(() => import('../routes/Credits/Credits.jsx'), 'Credits')
const NotFound = page(() => import('../routes/NotFound/NotFound.jsx'), 'NotFound')

// The style guide is a development tool: it is only bundled in `npm run dev`.
const Styleguide = import.meta.env.DEV ? lazy(() => import('../routes/Styleguide/Styleguide.jsx')) : null

// Providers, from the outside in:
// CRT effects → session (auth) → collection → toasts → router → smooth scroll → pages.
export function App() {
  return (
    <CrtEffectsProvider>
      <AuthProvider>
        <CollectionProvider>
          <ToastProvider>
            <BrowserRouter>
              <SmoothScroll>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="archive" element={<Archive />} />
                    <Route path="objects/:id" element={<Logbook />} />
                    <Route path="lab" element={<Lab />} />
                    <Route path="collection" element={<Collection />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="register" element={<Register />} />
                    <Route path="reset" element={<ResetPassword />} />
                    <Route path="credits" element={<Credits />} />
                    {Styleguide && <Route path="styleguide" element={<Styleguide />} />}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </SmoothScroll>
            </BrowserRouter>
          </ToastProvider>
        </CollectionProvider>
      </AuthProvider>
    </CrtEffectsProvider>
  )
}
