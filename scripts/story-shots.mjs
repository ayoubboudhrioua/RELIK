// Dev helper: viewport screenshots of the pinned Walkman story, one per chapter.
// Usage (with `npm run dev` running): node scripts/story-shots.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

const tracks = ['A1', 'A2', 'B1', 'B2']
for (let i = 0; i < tracks.length; i++) {
  await page.locator('[data-transport] button').nth(i).click()
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${outDir}/home-1440-story-${tracks[i]}.png` })
  console.log('saved story', tracks[i])
}
await browser.close()
