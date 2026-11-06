// Dev helper: quick technical accessibility checks on one route.
// Usage (with `npm run dev` running): node scripts/audit.mjs /route [width] [reduce]
// Prints headings, landmarks, small targets, unnamed controls, images without alt,
// the first tab stops with their focus outline, and horizontal overflow.
import { chromium } from '@playwright/test'

const [route = '/', width = '1440', reduce] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  reducedMotion: reduce === 'reduce' ? 'reduce' : 'no-preference',
})
await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

const report = await page.evaluate(() => {
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
  }
  const name = (el) =>
    (el.getAttribute('aria-label') ||
      (el.getAttribute('aria-labelledby') &&
        document.getElementById(el.getAttribute('aria-labelledby'))?.textContent) ||
      (el.labels && el.labels[0]?.textContent) ||
      el.textContent ||
      el.getAttribute('title') ||
      '').trim().replace(/\s+/g, ' ')

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(
    (h) => `${h.tagName} ${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)}`,
  )
  const landmarks = [...document.querySelectorAll('header,nav,main,footer,section[aria-labelledby],[role=region]')].map(
    (l) => `${l.tagName.toLowerCase()}${l.getAttribute('aria-label') ? ' "' + l.getAttribute('aria-label') + '"' : ''}`,
  )
  const controls = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(visible)
  const small = controls
    .map((el) => {
      const target = el.matches('input[type=checkbox],input[type=radio]') ? el.closest('label') ?? el : el
      const r = target.getBoundingClientRect()
      return { el, w: Math.round(r.width), h: Math.round(r.height) }
    })
    .filter(({ w, h }) => w < 44 || h < 44)
    .map(({ el, w, h }) => `${el.tagName.toLowerCase()} "${name(el).slice(0, 40)}" ${w}x${h}`)
  const unnamed = controls.filter((el) => !name(el)).map((el) => el.outerHTML.slice(0, 80))
  const imgs = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src)
  const overflow = document.documentElement.scrollWidth - window.innerWidth
  const pinned = document.querySelectorAll('.pin-spacer').length
  return { headings, landmarks, small, unnamed, imgs, overflow, pinned, controls: controls.length }
})

// Tab through the first stops and check that each shows an outline.
const tabs = []
for (let i = 0; i < 14; i++) {
  await page.keyboard.press('Tab')
  tabs.push(
    await page.evaluate(() => {
      const el = document.activeElement
      const s = getComputedStyle(el)
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36)
      return `${el.tagName.toLowerCase()} "${label}" outline=${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`
    }),
  )
}

console.log(JSON.stringify({ route, width, reduce: !!reduce, ...report, tabs }, null, 2))
await browser.close()
