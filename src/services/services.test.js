import { describe, expect, it } from 'vitest'
import { register, signIn, signOut, getSession, requestPasswordReset, AuthError, DEMO_ACCOUNT } from './auth.js'
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

  it('rejects impossible years in a passport', () => {
    expect(validateItem({ name: 'Walkman', year: '3000', status: 'Stored' })).toEqual({ year: 'yearInvalid' })
    expect(validateItem({ name: 'Walkman', year: '', status: 'Stored' })).toEqual({})
  })
})

describe('auth (simulated)', () => {
  const visitor = { name: 'Amine', email: 'Amine@Example.com', password: 'cassette79' }

  it('registers, signs out and signs back in', async () => {
    const session = await register(visitor)
    expect(session).toEqual({ name: 'Amine', email: 'amine@example.com' })
    expect(getSession()).toEqual(session)

    await signOut()
    expect(getSession()).toBeNull()

    await signIn({ email: 'amine@example.com', password: 'cassette79' })
    expect(getSession().name).toBe('Amine')
  })

  it('never stores the password as typed', async () => {
    await register(visitor)
    expect(JSON.stringify(readStorage('relik:users', {}))).not.toContain('cassette79')
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
  })

  it('creates the demo account on first use', async () => {
    const session = await signIn({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })
    expect(session.email).toBe(DEMO_ACCOUNT.email)
  })

  it('answers a reset request without revealing whether the account exists', async () => {
    await expect(requestPasswordReset({ email: 'nobody@example.com' })).resolves.toEqual({
      email: 'nobody@example.com',
    })
  })
})

describe('collection (simulated)', () => {
  const email = 'amine@example.com'

  it('starts empty for a new account and full of samples for the demo', () => {
    expect(listItems(email)).toEqual([])
    const demo = listItems(DEMO_ACCOUNT.email)
    expect(demo.length).toBe(6)
    expect(demo.every((item) => item.isSample)).toBe(true)
  })

  it('adds, edits and removes a passport', () => {
    const item = addItem(email, { name: 'Sony Walkman WM-2', year: '1981', status: 'In use' })
    expect(listItems(email)).toHaveLength(1)
    expect(item.year).toBe(1981)

    const updated = updateItem(email, item.id, { status: 'Needs repair', story: 'Belt slipping.' })
    expect(updated.status).toBe('Needs repair')
    expect(listItems(email)[0].story).toBe('Belt slipping.')

    removeItem(email, item.id)
    expect(listItems(email)).toEqual([])
  })

  it('saves an archive object once, and unsaves it', () => {
    saveObject(email, 'walkman-tps-l2')
    saveObject(email, 'walkman-tps-l2')
    expect(listItems(email)).toHaveLength(1)
    expect(isObjectSaved(email, 'walkman-tps-l2')).toBe(true)

    unsaveObject(email, 'walkman-tps-l2')
    expect(isObjectSaved(email, 'walkman-tps-l2')).toBe(false)
  })

  it('keeps guest saves and merges them at sign-in', () => {
    saveObject(null, 'game-boy')
    expect(getGuestSaves()).toEqual(['game-boy'])

    mergeGuestSaves(email)
    expect(isObjectSaved(email, 'game-boy')).toBe(true)
    expect(getGuestSaves()).toEqual([])
  })

  it('ignores unknown object ids', () => {
    expect(saveObject(email, 'not-an-object')).toBe(false)
  })
})
