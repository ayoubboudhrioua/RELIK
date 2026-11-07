// Dev helper: screenshots of the home terminal (after boot, mid-boot, reduced
// motion, phone) and the hero at first view.
// Usage (with `npm run dev` running): node scripts/terminal-shots.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots/phase8'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173/'
const SCREEN = '[aria-label="Archive terminal screen"]'
const browser = await chromium.launch()
const errors = []

async function open(width, height, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, ...options })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return page
}

// Desktop, first visit: frames during the boot, then the settled terminal.
{
  // A fake clock (it also drives requestAnimationFrame) makes every frame
  // land at an exact time, whatever the screenshot itself costs.
  const page = await open(1440, 900)
  // The clock is paused before the page loads, so the animation starts at 0.
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  let elapsed = 0
  for (const at of [80, 200, 500, 800, 1000, 1250]) {
    await page.clock.runFor(at - elapsed)
    elapsed = at
    await page.locator(SCREEN).screenshot({ path: `${outDir}/terminal-boot-${at}ms.png` })
  }
  await page.clock.runFor(3000)
  await page.clock.resume()
  await page.evaluate(() => document.fonts.ready)
  await page.locator(SCREEN).screenshot({ path: `${outDir}/terminal-1440.png` })
  await page.screenshot({ path: `${outDir}/hero-1440.png` })
  await page.close()
}

// Reduced motion: the terminal must show its final state at once.
{
  const page = await open(1440, 900, { reducedMotion: 'reduce' })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.locator(SCREEN).screenshot({ path: `${outDir}/terminal-1440-reduced.png` })
  await page.close()
}

// Phone.
{
  const page = await open(390, 844, { deviceScaleFactor: 2 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  await page.locator(SCREEN).screenshot({ path: `${outDir}/terminal-390.png` })
  await page.screenshot({ path: `${outDir}/hero-390.png` })
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
