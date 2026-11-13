import { createContext, useContext, useEffect, useState } from 'react'
import * as store from '../services/collection.js'
import { storageAvailable } from '../services/storage.js'
import { useAuth } from './useAuth.jsx'

const CollectionContext = createContext(null)

// Shares the visitor's collection with every page.
// Signed in: the list comes from the server. Signed out: `items` is empty but
// archive objects can still be saved (they join the collection at the next sign-in).
//
// useCollection() gives { items, loading, error, canStore, isSaved,
// saveObject, unsaveObject, addItem, updateItem, removeItem }.
// The actions are async and throw an ApiError if the server says no.
export function CollectionProvider({ children }) {
  const { user } = useAuth()
  const email = user?.email ?? null
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(Boolean(email))
  const [error, setError] = useState('') // an error code, e.g. 'network'
  const [guestSaves, setGuestSaves] = useState(() => store.getGuestSaves())

  async function load(isCancelled = () => false) {
    setGuestSaves(store.getGuestSaves())
    if (!email) {
      setItems([])
      setLoading(false)
      setError('')
      return
    }
    try {
      const list = await store.listItems(email)
      if (isCancelled()) return
      setItems(list)
      setError('')
    } catch (problem) {
      if (!isCancelled()) setError(problem.code ?? 'network')
    } finally {
      if (!isCancelled()) setLoading(false)
    }
  }

  // Reload when the visitor signs in or out.
  useEffect(() => {
    let cancelled = false
    setLoading(Boolean(email))
    load(() => cancelled)
    return () => {
      cancelled = true
    }
    // load() only depends on email.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const value = {
    items,
    loading,
    error,
    // False when the browser blocks storage: the page then warns that
    // the session will not be kept after the tab closes.
    canStore: storageAvailable(),
    isSaved(objectId) {
      return email ? items.some((item) => item.objectId === objectId) : guestSaves.includes(objectId)
    },
    async saveObject(objectId) {
      await store.saveObject(email, objectId)
      await load()
    },
    async unsaveObject(objectId) {
      await store.unsaveObject(email, objectId)
      await load()
    },
    async addItem(data) {
      const item = await store.addItem(email, data)
      await load()
      return item
    },
    async updateItem(id, changes) {
      const item = await store.updateItem(email, id, changes)
      await load()
      return item
    },
    async removeItem(id) {
      await store.removeItem(email, id)
      await load()
    },
  }

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) throw new Error('useCollection must be used inside <CollectionProvider>')
  return context
}
