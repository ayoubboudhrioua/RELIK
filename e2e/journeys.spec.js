import { test, expect } from '@playwright/test'

// The three user journeys from CLAUDE.md, on desktop (1440) and phone (390).
// Each test starts with empty storage, as a first-time visitor.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

const isPhone = (testInfo) => testInfo.project.name === 'mobile'

test('A: Home → Archive → filter → object → save → My Collection', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore the Archive' }).first().click()
  await expect(page).toHaveURL(/\/archive/)
  await expect(page.getByRole('heading', { level: 1, name: 'The Archive' })).toBeVisible()

  // Filter by the Gaming category (in a bottom sheet on phones).
  if (isPhone(testInfo)) {
    await page.getByRole('button', { name: /Filters/ }).click()
    await page.getByRole('dialog').getByLabel('Gaming').check()
    await page.getByRole('button', { name: /Show 2 objects/ }).click()
  } else {
    await page.getByLabel('Gaming').check()
  }
  await expect(page).toHaveURL(/cat=Gaming/)
  await expect(page.getByRole('status').filter({ hasText: 'objects found' })).toHaveText('2 objects found')

  // Open the Game Boy Logbook and save it.
  await page.getByRole('link', { name: /Game Boy/ }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: 'Game Boy (DMG-01)' })).toBeVisible()
  await page.getByRole('button', { name: 'Save to collection' }).filter({ visible: true }).click()
  await expect(page.getByText('Saved. Sign in to see it in your collection.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Saved for your collection' }).filter({ visible: true })).toBeVisible()

  // My Collection asks to sign in; the demo account then shows the saved object.
  await page.goto('/collection')
  await expect(page.getByRole('heading', { name: 'Sign in to open your collection' })).toBeVisible()
  await page.getByRole('link', { name: 'Sign in' }).last().click()
  await page.getByRole('button', { name: 'Use the demo account' }).click()
  await expect(page).toHaveURL(/\/collection/)
  await expect(page.getByRole('heading', { level: 3, name: 'Game Boy (DMG-01)' })).toBeVisible()
})

test('B: Home → Decision Lab → device → criteria → futures → reset', async ({ page }, testInfo) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter the Decision Lab' }).first().click()
  await expect(page).toHaveURL(/\/lab/)
  const live = page.locator('[role="status"][aria-live="polite"]').filter({ hasText: /Top future|^$/ }).first()

  // Step A: pick the Rio PMP300: its top future is Recover parts.
  await page.getByLabel(/Rio PMP300/).check()
  await expect(live).toContainText('Device: Rio PMP300. Top future: Recover parts')

  // Step B: raise "Does it work?" with the keyboard.
  if (isPhone(testInfo)) await page.getByRole('button', { name: 'Next' }).click()
  const works = page.getByRole('slider', { name: 'Does it work?' })
  await works.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(works).toHaveAttribute('aria-valuetext', 'Partly')
  await expect(live).toContainText('Does it work? set to Partly')

  // Step C: the explanation names a top future and says it is illustrative.
  if (isPhone(testInfo)) await page.getByRole('button', { name: 'Next' }).click()
  await expect(page.getByText('Illustrative, sample assumptions.').last()).toBeVisible()

  // Step D: change the priority.
  if (isPhone(testInfo)) await page.getByRole('button', { name: 'Next' }).click()
  await page.getByLabel('Recover materials').check()
  await expect(live).toContainText('Priority: Recover materials')

  // Reset: back to the Macintosh Classic, balanced, Preserve first.
  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(live).toContainText('Lab reset to Macintosh Classic. Top future: Preserve')
  if (!isPhone(testInfo)) await expect(page.getByLabel(/Macintosh Classic/)).toBeChecked()
})

test('C: Sign in → My Collection → add a Logbook → edit it → back to the collection', async ({ page }, testInfo) => {
  // Create an account on the server and land in an empty collection.
  // A new email each run, because the server keeps accounts between tests.
  await page.goto('/register')
  await page.getByLabel('Your name').fill('Amine')
  await page.getByLabel('Email').fill(`amine-${testInfo.project.name}-${Date.now()}@example.com`)
  await page.getByLabel('Password', { exact: true }).fill('cassette79')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/collection/)
  await expect(page.getByRole('heading', { name: 'Your rack is empty' })).toBeVisible()

  // Add a device: an empty submit shows the error summary first.
  await page.getByRole('button', { name: 'Add a device' }).first().click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Add to collection' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Give the object a name.')
  await dialog.getByLabel('Object name').fill('Sony Walkman WM-2')
  await dialog.getByLabel('Year').fill('1981')
  await dialog.getByLabel('In use').check()
  await dialog.getByRole('button', { name: 'Add to collection' }).click()
  await expect(page.getByText('Added to your collection.')).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'Sony Walkman WM-2' })).toBeVisible()

  // Edit it: change the status, then back to the rack.
  await page.getByRole('button', { name: 'Edit Logbook: Sony Walkman WM-2' }).click()
  await page.getByRole('dialog').getByLabel('Needs repair').check()
  await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Logbook updated.')).toBeVisible()
  const spine = page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Sony Walkman WM-2' }) })
  await expect(spine).toContainText('Needs repair')

  // Remove it, with confirmation.
  await page.getByRole('button', { name: 'Remove: Sony Walkman WM-2' }).click()
  await page.getByRole('button', { name: 'Remove it' }).click()
  await expect(page.getByRole('heading', { name: 'Your rack is empty' })).toBeVisible()
})
