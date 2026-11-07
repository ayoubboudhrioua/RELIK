// Dev helper: checks the scroll reveals (Phase 8.4).
// Usage (with `npm run dev` running): node scripts/scroll-check.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots/phase8/scroll'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173'
const browser = await chromium.launch()
const errors = []

async function open(width = 1440, height = 900, options = {}) {
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

// Scrolls the whole page slowly, like a visitor, then back to the top.
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 70))
    }
  })
  await page.waitForTimeout(1200)
}

// ---- Home: counter, meters, headings ----
{
  const page = await open()
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
  const digits = () =>
    page.$eval('[aria-labelledby="hero-title"] [class*="housing"]', (h) =>
      [...h.querySelectorAll('[style*="--digit"]')].map((w) => w.style.getPropertyValue('--digit')).join(''),
    )
  await page.waitForSelector('[aria-labelledby="hero-title"] [class*="housing"]')
  const early = await digits()
  await page.waitForTimeout(1500)
  console.log('hero counter wheels, first paint vs settled:', early, '→', await digits())

  const litAtRest = await page.$$eval('[aria-labelledby="hero-title"] [class*="segments"]', (bars) => bars.map((b) => b.querySelectorAll('[data-on]').length))
  await page.mouse.move(700, 500)
  let peak = [0, 0]
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 260)
    await page.waitForTimeout(30)
    const now = await page.$$eval('[aria-labelledby="hero-title"] [class*="segments"]', (bars) => bars.map((b) => b.querySelectorAll('[data-on]').length))
    peak = [Math.max(peak[0], now[0]), Math.max(peak[1], now[1])]
  }
  await page.waitForTimeout(1500)
  const litAfter = await page.$$eval('[aria-labelledby="hero-title"] [class*="segments"]', (bars) => bars.map((b) => b.querySelectorAll('[data-on]').length))
  console.log('VU meters L/R at rest', litAtRest.join('/'), '| peak while scrolling', peak.join('/'), '| after stopping', litAfter.join('/'))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  const hidden = await page.$$eval('h2', (hs) => hs.filter((h) => h.querySelector('[style*="105%"]')).map((h) => h.id))
  console.log('home headings waiting for their reveal:', hidden.join(', ') || 'none')

  // A heading caught mid-reveal.
  const target = page.locator('#passport-teaser-title')
  await target.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.8))
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${outDir}/home-heading-reveal-1440.png` })
  await scrollThrough(page)
  const stillSplit = await page.$$eval('h2', (hs) => hs.filter((h) => h.children.length > 0 && h.id !== 'results-title').map((h) => h.id))
  console.log('home headings still split after scrolling through:', stillSplit.join(', ') || 'none')
  await page.close()
}

// ---- Archive: cards stagger in, a filter never leaves one hidden ----
{
  const page = await open()
  await page.goto(BASE + '/archive', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const opacities = () => page.$$eval('[data-stagger] > li', (items) => items.map((i) => Number(getComputedStyle(i).opacity)))
  const before = await opacities()
  console.log('archive cards at load: visible', before.filter((o) => o === 1).length, 'waiting', before.filter((o) => o < 1).length)
  await page.evaluate(() => window.scrollTo(0, 1500))
  await page.waitForTimeout(220)
  await page.screenshot({ path: `${outDir}/archive-stagger-1440.png` })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  // Filter before the rest have arrived.
  await page.getByRole('checkbox', { name: /Computing/ }).first().check({ force: true })
  await page.waitForTimeout(600)
  const afterFilter = await opacities()
  console.log('after a filter: items', afterFilter.length, 'hidden', afterFilter.filter((o) => o < 1).length)
  await page.close()
}

// ---- Passport: spec rows tick in, the photo drifts ----
{
  const page = await open()
  await page.goto(BASE + '/objects/walkman-tps-l2', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const rows = () => page.$$eval('[data-tick] > *', (r) => r.map((x) => Number(getComputedStyle(x).opacity)))
  const r0 = await rows()
  await page.locator('[data-tick]').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  await page.screenshot({ path: `${outDir}/passport-rows-ticking-1440.png` })
  await page.waitForTimeout(1200)
  const r1 = await rows()
  console.log('passport rows hidden before', r0.filter((o) => o < 1).length, 'of', r0.length, '| after', r1.filter((o) => o < 1).length)
  await page.evaluate(() => window.scrollTo(0, 300))
  await page.waitForTimeout(500)
  console.log('passport photo transform at 300px:', await page.$eval('[data-parallax] img', (img) => img.style.transform))
  await page.close()
}

// ---- Reduced motion: nothing hidden, nothing split ----
{
  const page = await open(1440, 900, { reducedMotion: 'reduce' })
  for (const route of ['/', '/archive', '/objects/walkman-tps-l2']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    const hiddenCount = await page.$$eval('main *', (els) => els.filter((e) => e.style.opacity === '0').length)
    console.log('reduced motion', route, 'elements hidden by script:', hiddenCount)
  }
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
