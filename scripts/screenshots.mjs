// Takes full-page screenshots of routes at desktop (1440) and mobile (390) widths.
// Usage (with `npm run dev` running):
//   node scripts/screenshots.mjs <outDir> /route1 /route2 ...
// Example:
//   node scripts/screenshots.mjs ../screenshots/phase1 /styleguide
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [outDir = '../screenshots', ...routes] = process.argv.slice(2)
const base = process.env.BASE_URL ?? 'http://localhost:5173'
// WIDTHS=768,1024 node scripts/screenshots.mjs ... captures other widths.
const widths = process.env.WIDTHS
  ? process.env.WIDTHS.split(',').map((w) => ({ name: w, width: Number(w), height: 900 }))
  : [
      { name: '1440', width: 1440, height: 900 },
      { name: '390', width: 390, height: 844 },
    ]
const reduced = process.env.REDUCED === '1'

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const errors = []

for (const route of routes.length ? routes : ['/']) {
  for (const w of widths) {
    const page = await browser.newPage({
      viewport: { width: w.width, height: w.height },
      deviceScaleFactor: 1,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    })
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${route} @${w.name}: ${msg.text()}`)
    })
    page.on('pageerror', (err) => errors.push(`${route} @${w.name}: ${err.message}`))
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    // Load every lazy image (smooth scrolling can skip past them), then settle.
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll('img')]
      images.forEach((img) => (img.loading = 'eager'))
      await Promise.all(images.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r }))))
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 150))
      }
      window.scrollTo(0, 0)
      // Full-page captures can skip images that are loaded but not decoded yet.
      await Promise.all(images.map((img) => { img.decoding = 'sync'; return img.decode().catch(() => null) }))
    })
    await page.waitForTimeout(700)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 0) errors.push(`${route} @${w.name}: horizontal overflow of ${overflow}px`)
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '')
    const file = join(outDir, `${slug}-${w.name}${reduced ? '-reduced' : ''}.png`)
    await page.screenshot({ path: file, fullPage: true })
    console.log('saved', file)
    await page.close()
  }
}

await browser.close()
if (errors.length) {
  console.log('\nConsole errors:')
  for (const e of errors) console.log(' -', e)
} else {
  console.log('\nNo console errors.')
}
