// SIMULATED authentication. There is no server: accounts live in this
// browser's localStorage. The functions have the same shape a real auth API
// would have (async, throw on failure), so a real service could replace this file.
//
// Passwords are never stored as typed: we keep a SHA-256 hash. That is still
// not real security; it only avoids showing passwords in localStorage.

import { readStorage, writeStorage, removeStorage } from './storage.js'
import { validateRegister, validateSignIn, validateReset, hasErrors } from './validation.js'

const USERS_KEY = 'relik:users'
const SESSION_KEY = 'relik:session'

// A ready-made account so visitors can try the collection straight away.
export const DEMO_ACCOUNT = {
  name: 'Demo visitor',
  email: 'demo@relik.example',
  password: 'relik-demo',
}

// Fake network delay so loading states can be seen. No delay in tests.
const LATENCY = import.meta.env?.MODE === 'test' ? 0 : 450

function wait() {
  return new Promise((resolve) => setTimeout(resolve, LATENCY))
}

// An error with a `code` that matches a key in en.auth.errors.
export class AuthError extends Error {
  constructor(code, fields = {}) {
    super(code)
    this.name = 'AuthError'
    this.code = code
    this.fields = fields
  }
}

async function hash(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

function readUsers() {
  return readStorage(USERS_KEY, {})
}

function startSession(user) {
  const session = { name: user.name, email: user.email }
  writeStorage(SESSION_KEY, session)
  return session
}

// The signed-in user ({ name, email }) or null.
export function getSession() {
  return readStorage(SESSION_KEY, null)
}

export async function register({ name, email, password }) {
  const fields = validateRegister({ name, email, password })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)

  await wait()
  const users = readUsers()
  const key = normaliseEmail(email)
  if (users[key]) throw new AuthError('emailTaken', { email: 'emailTaken' })

  users[key] = { name: name.trim(), email: key, passwordHash: await hash(password) }
  writeStorage(USERS_KEY, users)
  return startSession(users[key])
}

export async function signIn({ email, password }) {
  const fields = validateSignIn({ email, password })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)

  await wait()
  const users = readUsers()
  const key = normaliseEmail(email)

  // The demo account is created the first time someone uses it.
  if (key === DEMO_ACCOUNT.email && !users[key]) {
    users[key] = {
      name: DEMO_ACCOUNT.name,
      email: key,
      passwordHash: await hash(DEMO_ACCOUNT.password),
    }
    writeStorage(USERS_KEY, users)
  }

  const user = users[key]
  if (!user || user.passwordHash !== (await hash(password))) {
    throw new AuthError('wrongCredentials')
  }
  return startSession(user)
}

export async function signOut() {
  removeStorage(SESSION_KEY)
}

// Always "succeeds" and never says whether the account exists,
// like a real reset form should. No email is sent.
export async function requestPasswordReset({ email }) {
  const fields = validateReset({ email })
  if (hasErrors(fields)) throw new AuthError('invalid', fields)
  await wait()
  return { email: normaliseEmail(email) }
}
