import { createContext, useContext, useEffect, useState } from 'react'
import * as auth from '../services/auth.js'
import { mergeGuestSaves } from '../services/collection.js'

const AuthContext = createContext(null)

// Shares the session with every page.
// useAuth() gives { user, signIn, register, signOut, requestPasswordReset }.
export function AuthProvider({ children }) {
  // Shown at once from the browser, then checked with the server.
  const [user, setUser] = useState(() => auth.getSession())

  useEffect(() => {
    let cancelled = false
    auth.checkSession().then((checked) => {
      if (!cancelled) setUser(checked)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Objects saved while signed out join the account. If that fails,
  // the visitor is still signed in and the saves stay in the browser.
  async function joinGuestSaves(email) {
    try {
      await mergeGuestSaves(email)
    } catch {
      // Nothing else to do.
    }
  }

  async function signIn(credentials) {
    const session = await auth.signIn(credentials)
    await joinGuestSaves(session.email)
    setUser(session)
    return session
  }

  async function register(details) {
    const session = await auth.register(details)
    await joinGuestSaves(session.email)
    setUser(session)
    return session
  }

  async function signOut() {
    await auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    signIn,
    register,
    signOut,
    requestPasswordReset: auth.requestPasswordReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
