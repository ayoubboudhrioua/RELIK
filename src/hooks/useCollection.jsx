import { createContext, useContext, useEffect, useState } from 'react'
import * as store from '../services/collection.js'
import { storageAvailable } from '../services/storage.js'
import { useAuth } from './useAuth.jsx'

const CollectionContext = createContext(null)

// Shares the visitor's collection with every page and keeps it in sync
// with localStorage. When signed out, `items` is empty but archive objects
// can still be saved (they join the collection at the next sign-in).
export function CollectionProvider({ children }) {
  const { user } = useAuth()
  const email = user?.email ?? null
  const [items, setItems] = useState(() => (email ? store.listItems(email) : []))
  const [guestSaves, setGuestSaves] = useState(() => store.getGuestSaves())

  // Reload when the visitor signs in or out.
  useEffect(() => {
    setItems(email ? store.listItems(email) : [])
    setGuestSaves(store.getGuestSaves())
  }, [email])

  function refresh() {
    setItems(email ? store.listItems(email) : [])
    setGuestSaves(store.getGuestSaves())
  }

  const value = {
    items,
    // False when the browser blocks storage: the page then warns that
    // the collection will not be kept.
    canStore: storageAvailable(),
    isSaved(objectId) {
      return email ? items.some((item) => item.objectId === objectId) : guestSaves.includes(objectId)
    },
    saveObject(objectId) {
      store.saveObject(email, objectId)
      refresh()
    },
    unsaveObject(objectId) {
      store.unsaveObject(email, objectId)
      refresh()
    },
    addItem(data) {
      const item = store.addItem(email, data)
      refresh()
      return item
    },
    updateItem(id, changes) {
      const item = store.updateItem(email, id, changes)
      refresh()
      return item
    },
    removeItem(id) {
      store.removeItem(email, id)
      refresh()
    },
  }

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) throw new Error('useCollection must be used inside <CollectionProvider>')
  return context
}
