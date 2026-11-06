import { createContext, useContext, useState } from 'react'
import * as auth from '../services/auth.js'
import { mergeGuestSaves } from '../services/collection.js'

const AuthContext = createContext(null)

// Shares the simulated session with every page.
// useAuth() gives { user, signIn, register, signOut, requestPasswordReset }.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.getSession())

  async function signIn(credentials) {
    const session = await auth.signIn(credentials)
    mergeGuestSaves(session.email)
    setUser(session)
    return session
  }

  async function register(details) {
    const session = await auth.register(details)
    mergeGuestSaves(session.email)
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
