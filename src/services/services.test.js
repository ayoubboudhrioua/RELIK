// The browser-side services, tested against a real RELIK server
// started on a spare port with an empty in-memory database.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb } from '../../server/db.js'
import { createApp } from '../../server/app.js'
import { setApiBase } from './api.js'
import { register, signIn, signOut, getSession, checkSession, requestPasswordReset, AuthError, DEMO_ACCOUNT } from './auth.js'
import {
  listItems,
  addItem,
  updateItem,
  removeItem,
  saveObject,
  unsaveObject,
  isObjectSaved,
  mergeGuestSaves,
  getGuestSaves,
} from './collection.js'
import { validateItem, validateRegister, isEmail } from './validation.js'
import { readStorage, writeStorage } from './storage.js'

let db
let server

beforeEach(async () => {
  db = createDb()
  server = await new Promise((resolve) => {
    const s = createApp(db).listen(0, () => resolve(s))
  })
  setApiBase(`http://localhost:${server.address().port}/api`)
})

afterEach(() => {
  server.close()
})

describe('storage', () => {
  it('returns the fallback when the key is missing or the JSON is broken', () => {
    expect(readStorage('relik:none', 'fallback')).toBe('fallback')
    localStorage.setItem('relik:broken', '{not json')
    expect(readStorage('relik:broken', 42)).toBe(42)
  })

  it('round-trips values', () => {
    writeStorage('relik:test', { a: 1 })
    expect(readStorage('relik:test', null)).toEqual({ a: 1 })
  })
})

describe('validation', () => {
  it('checks emails', () => {
    expect(isEmail('name@example.com')).toBe(true)
    expect(isEmail('name@example')).toBe(false)
  })

  it('reports each missing register field', () => {
    expect(validateRegister({ name: '', email: 'x', password: 'short' })).toEqual({
      name: 'nameRequired',
      email: 'emailInvalid',
      password: 'passwordShort',
    })
  })

  it('rejects impossible years in a Logbook', () => {
    expect(validateItem({ name: 'Walkman', year: '3000', status: 'Stored' })).toEqual({ year: 'yearInvalid' })
    expect(validateItem({ name: 'Walkman', year: '', status: 'Stored' })).toEqual({})
  })
})

describe('auth', () => {
  const visitor = { name: 'Amine', email: 'Amine@Example.com', password: 'cassette79' }

  it('registers, signs out and signs back in', async () => {
    const session = await register(visitor)
    expect(session).toEqual({ name: 'Amine', email: 'amine@example.com' })
    expect(getSession()).toEqual(session)
    expect(await checkSession()).toEqual(session)

    await signOut()
    expect(getSession()).toBeNull()

    await signIn({ email: 'amine@example.com', password: 'cassette79' })
    expect(getSession().name).toBe('Amine')
  })

  it('never stores the password as typed, on the server or in the browser', async () => {
    await register(visitor)
    expect(JSON.stringify(db.data)).not.toContain('cassette79')
    expect(JSON.stringify(localStorage.map ? [...localStorage.map] : [])).not.toContain('cassette79')
  })

  it('refuses a wrong password', async () => {
    await register(visitor)
    await expect(signIn({ email: visitor.email, password: 'wrong-password' })).rejects.toMatchObject({
      code: 'wrongCredentials',
    })
  })

  it('refuses a second account with the same email', async () => {
    await register(visitor)
    await expect(register(visitor)).rejects.toBeInstanceOf(AuthError)
    await expect(register(visitor)).rejects.toMatchObject({ code: 'emailTaken' })
  })

  it('checks forms before calling the server', async () => {
    await expect(register({ name: '', email: 'x', password: '' })).rejects.toMatchObject({
      code: 'invalid',
      fields: { name: 'nameRequired', email: 'emailInvalid', password: 'passwordRequired' },
    })
  })

  it('has a demo account ready', async () => {
    const session = await signIn({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })
    expect(session.email).toBe(DEMO_ACCOUNT.email)
  })

  it('forgets a session the server no longer knows', async () => {
    await register(visitor)
    db.data.sessions = {}
    expect(await checkSession()).toBeNull()
    expect(getSession()).toBeNull()
  })

  it('answers a reset request without revealing whether the account exists', async () => {
    await expect(requestPasswordReset({ email: 'nobody@example.com' })).resolves.toEqual({
      email: 'nobody@example.com',
    })
  })

  it('reports a server that is not running', async () => {
    setApiBase('http://localhost:1/api')
    await expect(signIn({ email: 'a@b.co', password: 'whatever1' })).rejects.toMatchObject({ code: 'network' })
  })
})

describe('collection', () => {
  const email = 'amine@example.com'

  beforeEach(async () => {
    await register({ name: 'Amine', email, password: 'cassette79' })
  })

  it('starts empty for a new account and full of samples for the demo', async () => {
    expect(await listItems(email)).toEqual([])
    await signIn({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })
    const demo = await listItems(DEMO_ACCOUNT.email)
    expect(demo.length).toBe(6)
    expect(demo.every((item) => item.isSample)).toBe(true)
  })

  it('adds, edits and removes a Logbook', async () => {
    const item = await addItem(email, { name: 'Sony Walkman WM-2', year: '1981', status: 'In use' })
    expect(await listItems(email)).toHaveLength(1)
    expect(item.year).toBe(1981)

    const updated = await updateItem(email, item.id, { status: 'Needs repair', story: 'Belt slipping.' })
    expect(updated.status).toBe('Needs repair')
    expect((await listItems(email))[0].story).toBe('Belt slipping.')

    await removeItem(email, item.id)
    expect(await listItems(email)).toEqual([])
  })

  it('refuses an invalid Logbook with the field errors', async () => {
    await expect(addItem(email, { name: '', year: '3000', status: 'Stored' })).rejects.toMatchObject({
      code: 'invalid',
      fields: { name: 'nameRequired', year: 'yearInvalid' },
    })
  })

  it('saves an archive object once, and unsaves it', async () => {
    await saveObject(email, 'walkman-tps-l2')
    await saveObject(email, 'walkman-tps-l2')
    expect(await listItems(email)).toHaveLength(1)
    expect(await isObjectSaved(email, 'walkman-tps-l2')).toBe(true)

    await unsaveObject(email, 'walkman-tps-l2')
    expect(await isObjectSaved(email, 'walkman-tps-l2')).toBe(false)
  })

  it('keeps guest saves in the browser and merges them at sign-in', async () => {
    await saveObject(null, 'game-boy')
    expect(getGuestSaves()).toEqual(['game-boy'])

    await mergeGuestSaves(email)
    expect(await isObjectSaved(email, 'game-boy')).toBe(true)
    expect(getGuestSaves()).toEqual([])
  })

  it('ignores unknown object ids', async () => {
    expect(await saveObject(email, 'not-an-object')).toBe(false)
  })

  it('keeps each account separate', async () => {
    await addItem(email, { name: 'Minitel 1B', status: 'Stored' })
    await signOut()
    await register({ name: 'Riley', email: 'riley@example.com', password: 'cassette79' })
    expect(await listItems('riley@example.com')).toEqual([])
  })
})
