// The RELIK API, tested over HTTP with an empty in-memory database.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb } from './db.js'
import { createApp } from './app.js'

let db
let server
let base

beforeEach(async () => {
  db = createDb()
  server = await new Promise((resolve) => {
    const s = createApp(db).listen(0, () => resolve(s))
  })
  base = `http://localhost:${server.address().port}/api`
})

afterEach(() => {
  server.close()
})

// call('POST', '/auth/login', { email, password }, token) → { status, body }
async function call(method, path, body, token) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(base + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  return { status: response.status, body: text ? JSON.parse(text) : null }
}

const amine = { name: 'Amine', email: 'amine@example.com', password: 'cassette79' }

describe('GET /api/health', () => {
  it('answers', async () => {
    expect(await call('GET', '/health')).toEqual({ status: 200, body: { ok: true } })
  })
})

describe('/api/auth', () => {
  it('registers and returns a token, never the password hash', async () => {
    const { status, body } = await call('POST', '/auth/register', amine)
    expect(status).toBe(201)
    expect(body.user).toEqual({ name: 'Amine', email: 'amine@example.com' })
    expect(typeof body.token).toBe('string')
    expect(JSON.stringify(body)).not.toContain('passwordHash')
  })

  it('validates on the server too', async () => {
    const { status, body } = await call('POST', '/auth/register', { name: '', email: 'x', password: 'short' })
    expect(status).toBe(400)
    expect(body).toEqual({
      error: 'invalid',
      fields: { name: 'nameRequired', email: 'emailInvalid', password: 'passwordShort' },
    })
  })

  it('refuses a taken email with 409', async () => {
    await call('POST', '/auth/register', amine)
    expect((await call('POST', '/auth/register', amine)).status).toBe(409)
  })

  it('logs in, tells who is signed in, and logs out', async () => {
    await call('POST', '/auth/register', amine)
    const login = await call('POST', '/auth/login', { email: 'AMINE@example.com', password: 'cassette79' })
    expect(login.status).toBe(200)

    const me = await call('GET', '/auth/me', undefined, login.body.token)
    expect(me.body.user.email).toBe('amine@example.com')

    expect((await call('POST', '/auth/logout', undefined, login.body.token)).status).toBe(204)
    expect((await call('GET', '/auth/me', undefined, login.body.token)).status).toBe(401)
  })

  it('refuses a wrong password with 401', async () => {
    await call('POST', '/auth/register', amine)
    const { status, body } = await call('POST', '/auth/login', { email: amine.email, password: 'nope-nope' })
    expect(status).toBe(401)
    expect(body.error).toBe('wrongCredentials')
  })

  it('answers broken JSON with 400', async () => {
    const response = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{broken',
    })
    expect(response.status).toBe(400)
  })
})

describe('/api/collection', () => {
  async function token() {
    return (await call('POST', '/auth/register', amine)).body.token
  }

  it('needs a signed-in user', async () => {
    expect((await call('GET', '/collection')).status).toBe(401)
  })

  it('adds, edits and deletes an item', async () => {
    const t = await token()
    const added = await call('POST', '/collection', { name: 'Minitel 1B', year: '1982', status: 'Stored' }, t)
    expect(added.status).toBe(201)
    expect(added.body.year).toBe(1982)

    const edited = await call('PATCH', `/collection/${added.body.id}`, { status: 'Preserved' }, t)
    expect(edited.body.status).toBe('Preserved')

    expect((await call('DELETE', `/collection/${added.body.id}`, undefined, t)).status).toBe(204)
    expect((await call('GET', '/collection', undefined, t)).body).toEqual([])
    expect((await call('DELETE', `/collection/${added.body.id}`, undefined, t)).status).toBe(404)
  })

  it('refuses an invalid item', async () => {
    const t = await token()
    const { status, body } = await call('POST', '/collection', { name: '', status: 'Stored' }, t)
    expect(status).toBe(400)
    expect(body.fields).toEqual({ name: 'nameRequired' })
  })

  it('saves an archive object once and can unsave it', async () => {
    const t = await token()
    expect((await call('POST', '/collection', { objectId: 'game-boy' }, t)).status).toBe(201)
    expect((await call('POST', '/collection', { objectId: 'game-boy' }, t)).status).toBe(200)
    expect((await call('GET', '/collection', undefined, t)).body).toHaveLength(1)

    await call('DELETE', '/collection/objects/game-boy', undefined, t)
    expect((await call('GET', '/collection', undefined, t)).body).toHaveLength(0)
    expect((await call('POST', '/collection', { objectId: 'nothing' }, t)).status).toBe(404)
  })

  it('gives the demo account its sample collection', async () => {
    const login = await call('POST', '/auth/login', { email: 'demo@relik.example', password: 'relik-demo' })
    const { body } = await call('GET', '/collection', undefined, login.body.token)
    expect(body).toHaveLength(6)
  })
})

describe('/api/objects', () => {
  it('lists, filters and finds objects', async () => {
    const all = await call('GET', '/objects')
    expect(all.body.length).toBeGreaterThan(10)

    const gaming = await call('GET', '/objects?cat=Gaming')
    expect(gaming.body.map((o) => o.id)).toEqual(['atari-2600', 'game-boy'])

    expect((await call('GET', '/objects?q=walkman')).body).toHaveLength(1)
    expect((await call('GET', '/objects/game-boy')).body.name).toBe('Game Boy (DMG-01)')
    expect((await call('GET', '/objects/nothing')).status).toBe(404)
  })

  it('answers unknown API paths with 404', async () => {
    expect((await call('GET', '/nothing')).status).toBe(404)
  })
})
