// Small wrappers around localStorage.
// Private windows or blocked storage can throw, so every call is guarded
// and the site keeps working with the fallback value.

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// True when this browser lets the site keep data (false in some private
// modes or when storage is blocked or full).
export function storageAvailable() {
  try {
    const probe = 'relik:probe'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to do: storage is unavailable.
  }
}
