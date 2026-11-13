// Talks to the RELIK server (see server/). Every call goes through request().
//
// - In development, Vite forwards /api/... to http://localhost:3001 (vite.config.js).
// - After `npm run build`, `npm start` serves the site and the API from the same server.
// - The tests point the base address at a server they start themselves (setApiBase).

import { readStorage, writeStorage, removeStorage } from './storage.js'

const TOKEN_KEY = 'relik:token'

let base = '/api'
// Kept here too, in case the browser refuses localStorage (some private modes).
let memoryToken = null

export function setApiBase(url) {
  base = url
}

// An error with a `code` that matches a key in en.auth.errors / en.collection.errors,
// and `fields` ({ field: 'errorKey' }) when the server rejected some form fields.
export class ApiError extends Error {
  constructor(code, fields = {}, status = 0) {
    super(code)
    this.name = 'ApiError'
    this.code = code
    this.fields = fields
    this.status = status
  }
}

export function getToken() {
  return readStorage(TOKEN_KEY, null) ?? memoryToken
}

export function setToken(token) {
  memoryToken = token
  writeStorage(TOKEN_KEY, token)
}

export function clearToken() {
  memoryToken = null
  removeStorage(TOKEN_KEY)
}

// request('/collection')                                  → GET
// request('/collection', { method: 'POST', body: {...} }) → POST with JSON
// Returns the JSON answer (null for "204 No Content"), or throws an ApiError.
export async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(base + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // The server is not running, or the network is down.
    throw new ApiError('network')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(data?.error ?? 'serverError', data?.fields ?? {}, response.status)
  return data
}
