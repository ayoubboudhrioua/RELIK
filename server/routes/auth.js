// /api/auth: create an account, sign in, sign out, who am I, reset password.
import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { validateRegister, validateSignIn, validateReset, hasErrors } from '../../src/services/validation.js'
import { hashPassword, checkPassword } from '../passwords.js'
import { sendError, normaliseEmail, readToken } from '../http.js'

// What the frontend is allowed to see about a user (never the password hash).
function publicUser(user) {
  return { name: user.name, email: user.email }
}

// Middleware for routes that need a signed-in user. Puts the user on req.user.
export function requireUser(db) {
  return (req, res, next) => {
    const token = readToken(req)
    const email = token ? db.data.sessions[token] : null
    const user = email ? db.data.users[email] : null
    if (!user) return sendError(res, 401, 'unauthorised')
    req.user = user
    req.token = token
    next()
  }
}

function startSession(db, user) {
  const token = randomUUID()
  db.data.sessions[token] = user.email
  db.save()
  return { user: publicUser(user), token }
}

export function authRouter(db) {
  const router = Router()

  // POST /api/auth/register  { name, email, password }
  router.post('/register', (req, res) => {
    const { name = '', email = '', password = '' } = req.body ?? {}
    const fields = validateRegister({ name, email, password })
    if (hasErrors(fields)) return sendError(res, 400, 'invalid', fields)

    const key = normaliseEmail(email)
    if (db.data.users[key]) return sendError(res, 409, 'emailTaken', { email: 'emailTaken' })

    const user = { name: name.trim(), email: key, passwordHash: hashPassword(password) }
    db.data.users[key] = user
    db.data.collections[key] = []
    res.status(201).json(startSession(db, user))
  })

  // POST /api/auth/login  { email, password }
  router.post('/login', (req, res) => {
    const { email = '', password = '' } = req.body ?? {}
    const fields = validateSignIn({ email, password })
    if (hasErrors(fields)) return sendError(res, 400, 'invalid', fields)

    const user = db.data.users[normaliseEmail(email)]
    if (!user || !checkPassword(password, user.passwordHash)) {
      return sendError(res, 401, 'wrongCredentials')
    }
    res.json(startSession(db, user))
  })

  // POST /api/auth/logout  (needs the token)
  router.post('/logout', requireUser(db), (req, res) => {
    delete db.data.sessions[req.token]
    db.save()
    res.status(204).end()
  })

  // GET /api/auth/me  (needs the token)
  router.get('/me', requireUser(db), (req, res) => {
    res.json({ user: publicUser(req.user) })
  })

  // POST /api/auth/reset  { email }
  // Always answers the same way, so nobody can find out which emails have an account.
  // No email is sent: this is a course project.
  router.post('/reset', (req, res) => {
    const { email = '' } = req.body ?? {}
    const fields = validateReset({ email })
    if (hasErrors(fields)) return sendError(res, 400, 'invalid', fields)
    res.status(202).json({ email: normaliseEmail(email) })
  })

  return router
}
