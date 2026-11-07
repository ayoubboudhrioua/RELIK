// The controller behind every <Backdrop />: one scroll listener and one
// visibility listener, shared by all the backdrop windows on the page.
// - Parallax: the glow moves at 0.2× the scroll speed. The glow repeats every
//   third of its height, so the offset wraps around without a visible seam.
// - When the tab is hidden, <html data-backdrop-paused> stops the drift.

const layers = new Map() // element → its repeat period in px
let frame = 0

function measure() {
  for (const element of layers.keys()) layers.set(element, element.offsetHeight / 3)
}

function render() {
  frame = 0
  const offset = window.scrollY * 0.2
  for (const [element, period] of layers) {
    const y = period > 0 ? offset % period : 0
    element.style.transform = `translate3d(0, ${-y}px, 0)`
  }
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(render)
}

function onResize() {
  measure()
  onScroll()
}

function onVisibility() {
  document.documentElement.toggleAttribute('data-backdrop-paused', document.hidden)
}

// Registers one moving layer. Returns the function that removes it.
export function addBackdropLayer(element) {
  if (layers.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    onVisibility()
  }
  layers.set(element, element.offsetHeight / 3)
  render()

  return () => {
    layers.delete(element)
    if (layers.size > 0) return
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    document.documentElement.removeAttribute('data-backdrop-paused')
    cancelAnimationFrame(frame)
    frame = 0
  }
}
