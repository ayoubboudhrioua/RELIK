// Dev helper: the Phase 8 screenshot set.
// - home at 1440 and 390, with motion and with reduced motion (full page);
// - the terminal after the boot;
// - the archive at 1440.
// (Story chapters: scripts/story-shots.mjs.)
// Usage (with `npm run dev` running): node scripts/phase8-shots.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots/phase8'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173'
const browser = await chromium.launch()
const errors = []

async function open(width, height, reducedMotion) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return page
}

// Scroll like a visitor so every reveal has played and every photo loaded,
// then go back to the top for a full-page capture.
async function settle(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'))
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
    await Promise.all([...document.images].map((img) => img.decode().catch(() => null)))
  })
  await page.waitForTimeout(1200)
}

for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const reduced of [false, true]) {
    const page = await open(width, height, reduced)
    await page.goto(BASE + '/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000) // the boot, on this first visit
    if (!reduced && width === 1440) {
      await page.locator('[aria-label="Archive terminal screen"]').screenshot({ path: `${outDir}/terminal-after-boot-1440.png` })
    }
    await settle(page)
    await page.screenshot({ path: `${outDir}/home-${width}${reduced ? '-reduced' : ''}.png`, fullPage: true })
    await page.close()
  }
}

{
  const page = await open(1440, 900, false)
  await page.goto(BASE + '/archive', { waitUntil: 'networkidle' })
  await settle(page)
  await page.screenshot({ path: `${outDir}/archive-1440.png`, fullPage: true })
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
