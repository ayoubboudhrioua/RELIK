import { useEffect, useState } from 'react'

// True once the web fonts have loaded, so text can be measured and split into
// lines correctly (SplitText). Fonts are preloaded, so this is usually quick.
export function useFontsReady() {
  const [ready, setReady] = useState(() => !document.fonts || document.fonts.status === 'loaded')
  useEffect(() => {
    if (ready) return
    let cancelled = false
    document.fonts.ready.then(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [ready])
  return ready
}
