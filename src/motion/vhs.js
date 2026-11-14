import { useSyncExternalStore } from 'react'

// The date and time stamp shown in the corners of the dark rooms, in VCR
// style ("PM 3:07", "NOV. 14 2026").
// One clock for the whole page, however many rooms show it. It ticks once a
// second, and only while at least one component is listening.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const listeners = new Set()
let snapshot = stamp(new Date())
let timer = 0

function stamp(now) {
  const hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return {
    clock: `${hours < 12 ? 'AM' : 'PM'} ${((hours + 11) % 12) + 1}:${minutes}`,
    date: `${MONTHS[now.getMonth()]}. ${day} ${now.getFullYear()}`,
  }
}

// Replaces the snapshot only when the text changed (once a minute), then
// tells the listeners.
function tick() {
  const next = stamp(new Date())
  if (next.clock === snapshot.clock && next.date === snapshot.date) return
  snapshot = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  if (listeners.size === 1) {
    tick()
    timer = setInterval(tick, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size > 0) return
    clearInterval(timer)
    timer = 0
  }
}

function getSnapshot() {
  return snapshot
}

// Read the stamp in a component: { clock, date }. It re-renders once a minute.
export function useVhs() {
  return useSyncExternalStore(subscribe, getSnapshot)
}