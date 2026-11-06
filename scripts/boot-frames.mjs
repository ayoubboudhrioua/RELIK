// Dev helper: screenshots of the hero CRT during the boot sequence, plus a
// reduced-motion capture. Usage: node scripts/boot-frames.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
const start = Date.now()
const screen = page.locator('[aria-label="Archive terminal screen"]')
for (const at of [150, 450, 800, 1300, 2500]) {
  await page.waitForTimeout(Math.max(0, at - (Date.now() - start)))
  await screen.screenshot({ path: `${outDir}/boot-${at}ms.png` })
}
const hasCanvas = await page.locator('canvas').count()
console.log('canvas elements:', hasCanvas, 'console errors:', errors)

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
await reduced.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await reduced.locator('[aria-label="Archive terminal screen"]').screenshot({ path: `${outDir}/boot-reduced.png` })
console.log('reduced-motion canvas elements:', await reduced.locator('canvas').count())
await browser.close()
