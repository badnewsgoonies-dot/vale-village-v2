import { test, expect } from '@playwright/test';

// Constants (no magic numbers)
const TIMEOUT_LONG = 120_000; // 2 minutes
const NAV_WAIT = 2_000;
const POLL_INTERVAL = 1_000;
const SCREENSHOT_DIR = '/tmp/vv2-screenshots';

test.skip(!process.env.RUN_HEAVY, 'Skipping heavy e2e tests by default');

test('Combat UI integration: action menu and abilities open/close', async ({ page }) => {
  test.setTimeout(TIMEOUT_LONG);

  // Navigate to app and wait for main menu
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});

  // Title -> Menu
  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();

  // Navigate to Battle Tower (menu navigation mirrors other e2e specs)
  await page.keyboard.press('ArrowDown'); // Compendium
  await page.keyboard.press('ArrowDown'); // Battle Tower
  await page.keyboard.press('Enter');

  await page.waitForTimeout(NAV_WAIT);

  // Start Tower Run
  const startButton = page.locator('button').filter({ hasText: /start tower run/i });
  await expect(startButton).toBeVisible({ timeout: 5000 });
  await startButton.click();
  await page.waitForTimeout(NAV_WAIT);

  // Click Begin Battle
  const beginButton = page.locator('button').filter({ hasText: /begin battle/i });
  await expect(beginButton).toBeVisible({ timeout: 5000 });
  await beginButton.click();
  await page.waitForTimeout(NAV_WAIT);

  // Press Enter to start battle from team select
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3_000);

  // Wait for queue/ battle view to appear
  const battleView = page.locator('[data-testid="battle-action-menu"]').first();
  const inBattle = await battleView.isVisible({ timeout: 15_000 }).catch(() => false);

  // Save initial screenshot for diagnostics
  await page.screenshot({ path: `${SCREENSHOT_DIR}/combat-start.png` }).catch(() => {});

  if (!inBattle) {
    // If the canonical action menu isn't present, try to detect alternative battle roots
    const altBattle = await page.locator('.gs-window, [aria-label*="Battle"]').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!altBattle) {
      // Capture failure screenshot and fail test with helpful logs
      await page.screenshot({ path: `${SCREENSHOT_DIR}/combat-failure-no-action-menu.png` }).catch(() => {});
      throw new Error('Battle UI did not appear: no action menu or battle window found');
    }
  }

  // Interact with the action menu: open abilities dialog and then back
  try {
    const actionMenu = page.locator('[data-testid="battle-action-menu"]').first();
    await expect(actionMenu).toBeVisible({ timeout: 10_000 });

    const psynergyBtn = actionMenu.locator('[data-testid="action-psynergy"]');
    await expect(psynergyBtn).toBeVisible({ timeout: 5000 });
    await psynergyBtn.click();

    // Expect abilities dialog
    const abilitiesDialog = page.locator('[data-testid="battle-action-menu-abilities"]');
    await expect(abilitiesDialog).toBeVisible({ timeout: 10_000 });

    // Take mid-battle screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/combat-abilities-open.png` }).catch(() => {});

    // Click back and ensure root action menu returns
    const backBtn = abilitiesDialog.locator('[data-testid="battle-back-btn"]');
    await expect(backBtn).toBeVisible({ timeout: 5000 });
    await backBtn.click();

    await expect(actionMenu).toBeVisible({ timeout: 5000 });
  } catch (err) {
    await page.screenshot({ path: `${SCREENSHOT_DIR}/combat-failure-interaction.png` }).catch(() => {});
    throw err;
  }

  // Basic assertion: action menu present and abilities dialog opened/closed successfully
  expect(true).toBe(true);
});
