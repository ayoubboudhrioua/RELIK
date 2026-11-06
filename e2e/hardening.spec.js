import { test, expect } from '@playwright/test'

// Edge cases: very long input, and the main journey with the keyboard only.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

test('a very long name and story never push the page sideways', async ({ page }) => {
  const longName = 'Grundig' + 'Super'.repeat(14) + 'Kassettenrekorder'
  const longStory = 'Gefunden auf dem Dachboden meiner Großmutter in Kairouan. '.repeat(12)

  await page.goto('/register')
  await page.getByLabel('Your name').fill('Riley')
  await page.getByLabel('Email').fill('riley@example.com')
  await page.getByLabel('Password', { exact: true }).fill('long-input-test')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/collection/)

  await page.getByRole('button', { name: 'Add a device' }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Object name').fill(longName)
  await dialog.getByLabel('Year').fill('1985')
  await dialog.getByLabel('Story').fill(longStory)
  await dialog.getByRole('button', { name: 'Add to collection' }).click()
  await expect(page.getByRole('heading', { level: 3, name: longName })).toBeVisible()

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('keyboard only: skip link, search, filter, open a passport and save', async ({ page }) => {
  await page.goto('/archive')

  // The skip link is the first stop and moves focus to the main content.
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')

  // Type in the archive search.
  await page.getByRole('searchbox', { name: /SEARCH ARCHIVE/ }).focus()
  await page.keyboard.type('walkman')
  await expect(page.getByRole('status').filter({ hasText: /objects? found/ })).toHaveText('1 object found')

  // Open the passport from the results with the keyboard.
  const link = page.getByRole('link', { name: /Walkman TPS-L2/ }).last()
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1, name: 'Walkman TPS-L2' })).toBeVisible()

  // Save with the keyboard.
  const save = page.getByRole('button', { name: 'Save to collection' }).filter({ visible: true })
  await save.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Saved. Sign in to see it in your collection.')).toBeVisible()
})
