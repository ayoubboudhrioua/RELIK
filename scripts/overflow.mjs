// Dev helper: lists the elements that stick out past the right edge of the screen.
// Usage: node scripts/overflow.mjs "/route?pseudo" [width]
import { chromium } from '@playwright/test'

const [route = '/', width = '390'] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(width), height: 844 } })
await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const offenders = await page.evaluate(() => {
  const limit = window.innerWidth
  const found = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    // Skip anything inside a container that scrolls or clips sideways.
    let clipped = false
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const o = getComputedStyle(a).overflowX
      if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') clipped = true
    }
    if (!clipped && r.width && r.right > limit + 1) {
      // Report only the innermost offenders (no child that also overflows).
      const childOverflows = [...el.children].some((c) => c.getBoundingClientRect().right > limit + 1)
      if (!childOverflows) found.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(r.right)} "${(el.textContent || '').trim().slice(0, 40)}"`)
    }
  }
  return found.slice(0, 15)
})
console.log(offenders.join('\n') || 'no overflow')
await browser.close()
