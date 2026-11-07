// Reusable scroll reveals. Each helper looks for marked elements inside
// `scope` and sets up ScrollTriggers that play once.
//
// Rules shared by every helper:
// - Call them inside useGSAP, so everything is undone when the page changes.
// - Never call them with reduced motion (RouteMotion checks this).
// - Anything already on the first screen is left alone: it never blinks out
//   and in, and it never delays the largest paint.
// - Only transform and opacity are animated.
// - Start states are set with gsap.set and the reveal plays in onEnter.
//   (A from() tween's start state would be wiped by ScrollTrigger.refresh().)
// - Each helper returns a cleanup function. useGSAP undoes the tweens and
//   triggers, but not the SplitText line wrappers, so those are undone here.
import { gsap, ScrollTrigger, SplitText } from './gsap.js'

// Every page starts at the top, so "on the first screen" means the element's
// position in the document is above the bottom of the window.
function onFirstScreen(element) {
  return element.getBoundingClientRect().top + window.scrollY < window.innerHeight
}

// Section headings (h2) rise line by line from behind a mask, once.
// Skipped: headings with child elements or dynamic text (counts, step letters),
// focus targets (tabindex), headings in dialogs and visually hidden ones.
// The split is undone as soon as the reveal ends, so React keeps its DOM.
export function revealHeadings(scope) {
  const splits = []
  const headings = [...scope.querySelectorAll('h2')].filter(
    (h) =>
      h.children.length === 0 &&
      !h.hasAttribute('tabindex') &&
      !h.hasAttribute('data-no-reveal') &&
      !h.closest('dialog') &&
      !h.classList.contains('visually-hidden') &&
      h.offsetWidth > 0 &&
      !onFirstScreen(h),
  )
  for (const heading of headings) {
    const split = SplitText.create(heading, { type: 'lines', mask: 'lines' })
    splits.push(split)
    gsap.set(split.lines, { yPercent: 105 })
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          onComplete: () => split.revert(),
        }),
    })
  }
  return () => splits.forEach((split) => split.revert())
}

// Lists marked data-stagger: their items slide up a little and fade in, in
// small batches as they arrive (ScrollTrigger.batch).
// A list that appears within LATE_LIST_MS of the page (the Archive shows a
// short skeleton on the first visit) is staggered too; later lists are not.
// Returns finish(): shows every item still waiting and stops the batches.
// It runs as soon as a list's items change (a filter, a search), so a change
// never re-animates anything and never leaves an item hidden.
const LATE_LIST_MS = 1500

export function staggerLists(scope) {
  const pending = new Set()
  const triggers = []
  const observers = []
  const prepared = new WeakSet()
  let stopWatching = 0

  function finish() {
    triggers.forEach((trigger) => trigger.kill())
    observers.forEach((observer) => observer.disconnect())
    clearTimeout(stopWatching)
    if (pending.size) gsap.set([...pending], { clearProps: 'opacity,transform' })
    pending.clear()
  }

  function prepare(list) {
    if (prepared.has(list)) return
    prepared.add(list)
    const items = [...list.children].filter((item) => !onFirstScreen(item))
    if (!items.length) return
    items.forEach((item) => pending.add(item))
    gsap.set(items, { opacity: 0, y: 16 })
    triggers.push(
      ...ScrollTrigger.batch(items, {
        start: 'top 94%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((item) => pending.delete(item))
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', clearProps: 'opacity,transform' })
        },
      }),
    )
    const observer = new MutationObserver(finish)
    observer.observe(list, { childList: true })
    observers.push(observer)
  }

  scope.querySelectorAll('[data-stagger]').forEach(prepare)

  // Lists that arrive just after the page (skeleton → results).
  const watcher = new MutationObserver(() => scope.querySelectorAll('[data-stagger]').forEach(prepare))
  watcher.observe(scope, { childList: true, subtree: true })
  stopWatching = setTimeout(() => watcher.disconnect(), LATE_LIST_MS)
  observers.push(watcher)

  return finish
}

// Rows marked data-tick (the children of the element) tick in one after
// another, like a printer filling in a spec sheet.
export function tickRows(scope) {
  for (const sheet of scope.querySelectorAll('[data-tick]')) {
    const rows = [...sheet.children].filter((row) => !onFirstScreen(row))
    if (!rows.length) continue
    gsap.set(rows, { opacity: 0, x: -8 })
    ScrollTrigger.create({
      trigger: rows[0],
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(rows, { opacity: 1, x: 0, duration: 0.22, stagger: 0.06, ease: 'power2.out' }),
    })
  }
}

// The photo inside an element marked data-parallax drifts down slightly
// slower than the page as it scrolls away.
export function parallaxPhotos(scope) {
  for (const holder of scope.querySelectorAll('[data-parallax]')) {
    const photo = holder.querySelector('img')
    if (!photo) continue
    gsap.set(photo, { transition: 'none' }) // the bay's hover transition would lag behind
    gsap.to(photo, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: holder, start: 'top top', end: 'bottom top', scrub: true },
    })
  }
}
