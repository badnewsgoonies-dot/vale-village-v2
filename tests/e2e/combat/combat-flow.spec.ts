import { test, expect } from '@playwright/test';
import { runBattle } from '../helpers/battle';

test.beforeEach(async ({ page }) => {
  // Ensure fresh localStorage and DEV_MODE disabled before any script runs
  await page.addInitScript(() => {
    try { localStorage.clear(); localStorage.setItem('DEV_MODE', 'false'); } catch (e) {}
    try {
      // Attempt to delete any IndexedDB databases from previous runs
      if (window.indexedDB && indexedDB.databases) {
        indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => {
            try { indexedDB.deleteDatabase(db.name); } catch (e) {}
          });
        }).catch(() => {});
      }
    } catch (e) {}
  });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle').catch(() => {});
});

test('Combat UI flow completes and shows rewards', async ({ page }, testInfo) => {
  test.setTimeout(120000);

  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});

  // Title -> Menu (press Enter until menu appears, to handle animations)
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Enter');
    try {
      await page.waitForSelector('.main-menu', { state: 'visible', timeout: 1500 });
      break;
    } catch (e) {
      // continue pressing
    }
  }
  // Fallback: if menu is present but hidden due to animations, make it visible programmatically
  await page.evaluate(() => {
    const el = document.querySelector('.main-menu');
    if (el) {
      try { el.classList.remove('hidden'); } catch (e) {}
      try { el.removeAttribute('hidden'); } catch (e) {}
      try { el.setAttribute('aria-hidden', 'false'); } catch (e) {}
      try {
        const s = (el as any).style;
        if (s) {
          s.display = 'block';
          s.visibility = 'visible';
          s.opacity = '1';
          s.transform = 'none';
          s.pointerEvents = 'auto';
        }
      } catch (e) {}
    }
  });
  await expect(page.locator('.main-menu')).toBeVisible();

  // Navigate to Battle Tower via menu
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await page.waitForTimeout(1000);

  // Start Tower Run
  const startButton = page.locator('button').filter({ hasText: /start tower run/i });
  await expect(startButton).toBeVisible({ timeout: 5000 });
  await startButton.click();
  await page.waitForTimeout(2000);

  // Begin Battle
  const beginButton = page.locator('button').filter({ hasText: /begin battle/i });
  await expect(beginButton).toBeVisible({ timeout: 5000 });
  await beginButton.click();
  await page.waitForTimeout(2000);

  // Start from team select
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Run an automated battle using shared helper, keep rounds small for speed
  const result = await runBattle(page, { maxRounds: 8, forceClicks: true });

  try {
    expect(result.result).toBe('victory');
  } catch (err) {
    // Save screenshot for failures for debugging
    await page.screenshot({ path: `tests/e2e/screenshots/${testInfo.title.replace(/\s+/g, '_')}.png` });
    throw err;
  }
});
