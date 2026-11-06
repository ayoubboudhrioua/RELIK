// Vitest runs in Node, which has no browser storage.
// This gives the services a simple in-memory localStorage, cleared before each test.
import { beforeEach } from 'vitest'

class MemoryStorage {
  constructor() {
    this.map = new Map()
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null
  }
  setItem(key, value) {
    this.map.set(key, String(value))
  }
  removeItem(key) {
    this.map.delete(key)
  }
  clear() {
    this.map.clear()
  }
}

globalThis.window = globalThis
globalThis.localStorage = new MemoryStorage()

beforeEach(() => {
  globalThis.localStorage.clear()
})
