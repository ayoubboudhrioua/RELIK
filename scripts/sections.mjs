// Dev helper: screenshots each element matching a selector, at full resolution.
// Usage (with `npm run dev` running):
//   node scripts/sections.mjs <outDir> <route> "<selector>" [width]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir, route, selector, width = '1440'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } })
await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

const elements = await page.$$(selector)
for (let i = 0; i < elements.length; i++) {
  await elements[i].scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await elements[i].screenshot({ path: `${outDir}/${width}-${String(i).padStart(2, '0')}.png` })
}
console.log('saved', elements.length)
await browser.close()
