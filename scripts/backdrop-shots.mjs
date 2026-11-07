// Dev helper: viewport screenshots of the dark rooms with the animated
// backdrop on, plus checks that the backdrop is off with reduced motion and
// that the drift pauses when the tab is hidden.
// Usage (with `npm run dev` running): node scripts/backdrop-shots.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots/phase8/backdrop'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173'
const browser = await chromium.launch()
const errors = []

async function open(width, height, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, ...options })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('relik:booted', '1')
    } catch {}
  })
  return page
}

const shots = [
  ['home-top', '/', 0],
  ['home-lab-teaser', '/', 'section[aria-labelledby="lab-teaser-title"]'],
  ['home-closing', '/', 'section[aria-labelledby="closing-title"]'],
  ['archive', '/archive', 0],
  ['lab', '/lab', 0],
  ['Logbook', '/objects/walkman-tps-l2', 0],
  ['signin', '/signin', 0],
]

for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const [name, route, target] of shots) {
    const page = await open(width, height)
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    if (typeof target === 'string') {
      await page.locator(target).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80))
    }
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${outDir}/${name}-${width}.png` })
    await page.close()
  }
}

// Reduced motion: no backdrop at all.
{
  const page = await open(1440, 900, { reducedMotion: 'reduce' })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  console.log('reduced motion, backdrop windows:', await page.locator('[data-backdrop]').count())
  await page.close()
}

// Hidden tab: the drift pauses.
{
  const page = await open(1440, 900)
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  console.log('backdrop windows on home:', await page.locator('[data-backdrop]').count())
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  const state = await page.locator('[class*="_glow_"]').first().evaluate((el) => getComputedStyle(el).animationPlayState)
  console.log('hidden tab, glow animation:', state)
  // Parallax: after scrolling 1000px the glow has moved 200px.
  await page.evaluate(() => window.scrollTo(0, 1000))
  await page.waitForTimeout(600)
  console.log('shift after 1000px scroll:', await page.locator('[class*="_shift_"]').first().evaluate((el) => el.style.transform))
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
