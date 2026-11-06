import { useEffect } from 'react'
import { en } from '../content/en.js'

// Sets the browser tab title, e.g. "The Archive · RELIK".
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${en.site.titleSuffix}` : en.site.titleSuffix
  }, [title])
}
