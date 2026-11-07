// Captures the screens for the Figma export as PNG tiles plus a manifest.
// Usage (with `npm run dev` running): node scripts/figma-export.mjs <outDir>
// - Boot sequence marked as done, CRT effects on, reduced motion (no animation
//   mid-way; the Walkman story renders as stacked chapters).
// - Long pages are cut into tiles of at most 4000px, because Figma downscales
//   images taller than 4096px.
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [outDir = '../screenshots/figma'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173'
const TILE = 4000
const manifest = []
const browser = await chromium.launch()

async function newPage(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('relik:booted', '1')
      localStorage.setItem('relik:crt', JSON.stringify('on'))
    } catch {}
  })
  return page
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(async () => {
    const images = [...document.querySelectorAll('img')]
    images.forEach((img) => (img.loading = 'eager'))
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    await Promise.all(images.map((img) => { img.decoding = 'sync'; return img.decode().catch(() => null) }))
  })
  await page.waitForTimeout(500)
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Full page, cut into tiles.
async function fullPage(page, name) {
  const width = page.viewportSize().width
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const tiles = []
  for (let y = 0, i = 0; y < height; y += TILE, i++) {
    const h = Math.min(TILE, height - y)
    const file = `${slug(name)}-${i}.png`
    await page.screenshot({ path: join(outDir, file), fullPage: true, clip: { x: 0, y, width, height: h } })
    tiles.push({ file, y, w: width, h })
  }
  manifest.push({ frame: name, width, height, tiles })
  console.log(name, `${width}x${height}`, tiles.length, 'tile(s)')
}

// Only what is on screen (dialogs, toasts).
async function viewport(page, name) {
  const { width, height } = page.viewportSize()
  const file = `${slug(name)}-0.png`
  await page.screenshot({ path: join(outDir, file) })
  manifest.push({ frame: name, width, height, tiles: [{ file, y: 0, w: width, h: height }] })
  console.log(name, `${width}x${height}`, 'viewport')
}

async function signInDemo(page) {
  await page.goto(BASE + '/signin', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Use the demo account' }).click()
  await page.waitForURL('**/collection')
}

// ---- The six screens at 1440 and 390 ----
for (const [device, width, height] of [['Desktop', 1440, 900], ['Mobile', 390, 844]]) {
  const screens = [
    ['Home', '/'],
    ['Archive', '/archive'],
    ['Logbook (Walkman)', '/objects/walkman-tps-l2'],
    ['Decision Lab', '/lab'],
    ['Sign in', '/signin'],
  ]
  for (const [label, route] of screens) {
    const page = await newPage(width, height)
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await settle(page)
    await fullPage(page, `${device} / ${label}`)
    await page.close()
  }
  const page = await newPage(width, height)
  await signInDemo(page)
  await settle(page)
  await fullPage(page, `${device} / My Collection`)
  await page.close()
}

// ---- Key states (desktop) ----
{
  const page = await newPage(1440, 900)
  await page.goto(BASE + '/archive?q=zeppelin', { waitUntil: 'networkidle' })
  await settle(page)
  await fullPage(page, 'Desktop / States / Archive empty state')

  await page.goto(BASE + '/archive', { waitUntil: 'networkidle' })
  await settle(page)
  await page.getByRole('button', { name: 'Quick look: Walkman TPS-L2' }).click()
  await page.waitForTimeout(500)
  await viewport(page, 'Desktop / States / Quick look open')
  await page.close()
}
{
  const page = await newPage(1440, 900)
  await page.goto(BASE + '/lab', { waitUntil: 'networkidle' })
  await settle(page)
  await page.getByLabel(/Rio PMP300/).check()
  const works = page.getByRole('slider', { name: 'Does it work?' })
  await works.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.locator('h2#step-b').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await fullPage(page, 'Desktop / States / Decision Lab after a change')
  await page.close()
}
{
  const page = await newPage(1440, 900)
  await signInDemo(page)
  await page.getByRole('button', { name: 'Add a device' }).first().click()
  await page.getByRole('dialog').getByRole('button', { name: 'Add to collection' }).click()
  await page.waitForTimeout(400)
  await viewport(page, 'Desktop / States / Logbook form with errors')
  await page.close()
}
{
  const page = await newPage(1440, 900)
  await page.goto(BASE + '/objects/walkman-tps-l2', { waitUntil: 'networkidle' })
  await settle(page)
  await page.getByRole('button', { name: 'Save to collection' }).filter({ visible: true }).click()
  await page.waitForTimeout(500)
  await viewport(page, 'Desktop / States / Save toast')
  await page.close()
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log('frames:', manifest.length, 'tiles:', manifest.reduce((n, f) => n + f.tiles.length, 0))
await browser.close()
