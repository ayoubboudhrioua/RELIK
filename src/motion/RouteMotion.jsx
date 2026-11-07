import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { ScrollTrigger, useGSAP } from './gsap.js'
import { useFontsReady } from './useFontsReady.js'
import { parallaxPhotos, revealHeadings, staggerLists, tickRows } from './reveals.js'

// Sets up the scroll reveals of the current page (see reveals.js).
// Layout renders it next to the page, inside the same Suspense boundary and
// keyed by the path, so it runs once the page is on screen and everything it
// created is undone (useGSAP) when the visitor goes to another page.
// It renders nothing; with reduced motion it does nothing.
export function RouteMotion() {
  const reducedMotion = useReducedMotion()
  const fontsReady = useFontsReady()

  useGSAP(
    () => {
      if (reducedMotion || !fontsReady) return
      const main = document.getElementById('main')
      if (!main) return
      const undoHeadings = revealHeadings(main)
      tickRows(main)
      parallaxPhotos(main)
      const finishLists = staggerLists(main)
      // Triggers may have been created out of page order (the pinned story
      // adds height): sort and measure them all again.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      return () => {
        finishLists()
        undoHeadings()
      }
    },
    { dependencies: [reducedMotion, fontsReady], revertOnUpdate: true },
  )

  return null
}
