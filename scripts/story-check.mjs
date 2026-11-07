// Dev helper: checks the pinned Walkman story.
// - a frame in the middle of a chapter change, and a close-up of the reels;
// - scrolling back up leaves only chapter A1 visible;
// - the phone layout (stacked chapters, transport bar at the bottom);
// - Home → Archive → Home three times leaves no pin spacer behind.
// Usage (with `npm run dev` running): node scripts/story-check.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const [outDir = '../screenshots/phase8/story'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const BASE = 'http://localhost:5173'
const browser = await chromium.launch()
const errors = []

async function open(width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('relik:booted', '1')
    } catch {}
  })
  return page
}

// Scroll position (px) for a given progress through the pinned story.
async function storyY(page, progress) {
  return page.evaluate((p) => {
    const spacer = document.querySelector('section[aria-labelledby="story-title"]').parentElement
    const top = spacer.getBoundingClientRect().top + window.scrollY
    return top + window.innerHeight * 4 * p
  }, progress)
}

const visibleChapters = (page) =>
  page.$$eval('[data-chapter]', (els) => els.map((el) => Number(getComputedStyle(el).opacity).toFixed(2)))

{
  const page = await open(1440, 900)
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  // Mid-change A1 → A2: jump just past the boundary and catch it while scrubbing.
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.2))
  await page.waitForTimeout(1200)
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.255))
  await page.waitForTimeout(260)
  await page.screenshot({ path: `${outDir}/transition-A1-A2-1440.png` })

  // Reels close-up at the end of the tape.
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.875))
  await page.waitForTimeout(1500)
  await page.locator('[data-transport] svg').first().screenshot({ path: `${outDir}/reels-end.png` })
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.125))
  await page.waitForTimeout(1500)
  await page.locator('[data-transport] svg').first().screenshot({ path: `${outDir}/reels-start.png` })

  // Down to B2, then back up to A1: only A1 may be visible.
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.875))
  await page.waitForTimeout(1500)
  await page.evaluate((y) => window.scrollTo(0, y), await storyY(page, 0.1))
  await page.waitForTimeout(1500)
  console.log('chapter opacity after scrolling back to A1:', (await visibleChapters(page)).join(' '))
  console.log(
    'current track:',
    await page.$eval('[data-transport] [aria-current="step"]', (el) => el.textContent.trim()),
  )
  await page.close()
}

// Phone: stacked chapters, transport bar stuck to the bottom of the screen.
{
  const page = await open(390, 844)
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  const chapter = page.locator('[data-chapter="2"]')
  await chapter.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${outDir}/stacked-390.png` })
  const bar = await page.$eval('[data-transport]', (el) => {
    const box = el.getBoundingClientRect()
    return { top: Math.round(box.top), bottom: Math.round(box.bottom), viewport: window.innerHeight }
  })
  console.log('phone transport bar:', JSON.stringify(bar))
  await page.close()
}

// Route changes: no pin spacers or duplicate triggers left behind.
{
  const page = await open(1440, 900)
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  for (let i = 0; i < 3; i++) {
    await page.getByRole('navigation', { name: 'Main' }).first().getByRole('link', { name: 'Archive' }).click()
    await page.waitForURL('**/archive')
    await page.waitForTimeout(500)
    const spacersOnArchive = await page.locator('.pin-spacer').count()
    await page.getByRole('link', { name: /^RELIK.*home$/ }).click()
    await page.waitForURL(BASE + '/')
    await page.waitForTimeout(800)
    const spacersOnHome = await page.locator('.pin-spacer').count()
    console.log(`round ${i + 1}: pin spacers on archive ${spacersOnArchive}, on home ${spacersOnHome}`)
  }
  await page.close()
}

console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
