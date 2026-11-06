// Dev helper: screenshots of the signed-in collection (demo account) and its dialogs.
// Usage (with `npm run dev` running): node scripts/signed-in-shots.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()

for (const [name, width, height] of [['1440', 1440, 900], ['390', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto('http://localhost:5173/signin', { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.getByRole('button', { name: 'Use the demo account' }).click()
  await page.waitForURL('**/collection')
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${outDir}/collection-signed-in-${name}.png`, fullPage: true })

  await page.getByRole('button', { name: /^Edit passport/ }).first().click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outDir}/collection-edit-${name}.png` })
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: /^Remove/ }).first().click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outDir}/collection-remove-${name}.png` })
  await page.keyboard.press('Escape')

  await page.goto('http://localhost:5173/signin', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outDir}/signin-errors-${name}.png`, fullPage: true })
  await page.close()
  console.log('saved signed-in shots', name)
}
await browser.close()
