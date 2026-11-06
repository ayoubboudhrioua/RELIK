// Dev helper: first-viewport screenshots at several sizes, plus where the
// main heading and first primary key end up.
// Usage (with `npm run dev` running):
//   node scripts/viewport.mjs <outDir> <route> 1280x720 1366x768 1440x900 390x844
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir, route = '/', ...sizes] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

for (const size of sizes) {
  const [width, height] = size.split('x').map(Number)
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1600) // let the boot readout finish
  const box = await page.evaluate(() => {
    const r = (el) => (el ? Math.round(el.getBoundingClientRect().bottom) : null)
    return {
      h1Bottom: r(document.querySelector('h1')),
      firstKeyBottom: r(document.querySelector('main a[href="/archive"]')),
    }
  })
  await page.screenshot({ path: `${outDir}/viewport-${size}.png` })
  console.log(size, JSON.stringify(box), box.firstKeyBottom <= height ? 'fits' : 'BELOW FOLD')
  await page.close()
}
await browser.close()
