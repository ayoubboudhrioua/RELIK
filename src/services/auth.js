// Accounts and sessions, through the RELIK server (server/routes/auth.js).
// The server keeps the accounts; this file keeps the session token and the
// signed-in user ({ name, email }) in the browser so pages can show them at once.
//
// Forms are checked here first (same rules as the server) so errors appear
// without waiting for the network.

import { readStorage, writeStorage, removeStorage } from './storage.js'
import { validateRegister, validateSignIn, validateReset, hasErrors } from './validation.js'
import { request, ApiError, getToken, setToken, clearToken } from './api.js'

const SESSION_KEY = 'relik:session'
let memorySession = null

// A ready-made account so visitors can try the collection straight away.
// The server creates it when it starts (server/demo.js).
export const DEMO_ACCOUNT = {
  name: 'Demo visitor',
  email: 'demo@relik.example',
  password: 'relik-demo',
}

// Pages import AuthError; it is the same error the API helper throws.
export const AuthError = ApiError

function startSession({ user, token }) {
  setToken(token)
  memorySession = user
  writeStorage(SESSION_KEY, user)
  return user
}

function endSession() {
  clearToken()
  memorySession = null
  removeStorage(SESSION_KEY)
}

// The signed-in user ({ name, email }) or null. Instant: no network call.
export function getSession() {
  if (!getToken()) return null
  return readStorage(SESSION_KEY, null) ?? memorySession
}

// Asks the server whether the saved session is still valid.
// Returns the user, or null (and forgets the session) if the server says no.
export async function checkSession() {
  if (!getToken()) return null
  try {
    const { user } = await request('/auth/me')
    memorySession = user
    writeStorage(SESSION_KEY, user)
    return user
  } catch (error) {
    if (error.status === 401) {
      endSession()
      return null
    }
    // Server unreachable: keep what we have.
    return getSession()
  }
}

export async function register({ name, email, password }) {
  const fields = validateRegister({ name, email, password })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)
  const answer = await request('/auth/register', { method: 'POST', body: { name, email, password } })
  return startSession(answer)
}

export async function signIn({ email, password }) {
  const fields = validateSignIn({ email, password })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)
  const answer = await request('/auth/login', { method: 'POST', body: { email, password } })
  return startSession(answer)
}

export async function signOut() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } catch {
    // Signed out locally even if the server cannot be reached.
  } finally {
    endSession()
  }
}

// The server always "succeeds" and never says whether the account exists,
// like a real reset form should. No email is sent.
export async function requestPasswordReset({ email }) {
  const fields = validateReset({ email })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)
  return request('/auth/reset', { method: 'POST', body: { email } })
}
