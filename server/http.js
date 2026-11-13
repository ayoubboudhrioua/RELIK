// Small helpers shared by the routes.

// Sends an error the frontend understands: { error: "<code>", fields: { field: "<errorKey>" } }.
// The codes match the keys in src/content/en.js (en.auth.errors, en.collection.errors).
export function sendError(res, status, code, fields = {}) {
  res.status(status).json({ error: code, fields })
}

export function normaliseEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

// Reads the token from "Authorization: Bearer <token>".
export function readToken(req) {
  const header = req.get('authorization') ?? ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}
