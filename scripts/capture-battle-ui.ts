/**
 * Playwright script to capture battle UI screenshots
 * Run: npx playwright test scripts/capture-battle-ui.ts
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = './screenshots/battle-ui';

test.describe('Battle UI Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for app to load
    await page.waitForTimeout(1000);
  });

  test('capture initial game state', async ({ page }) => {
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-initial-load.png`,
      fullPage: true
    });
  });

  test('capture battle planning phase', async ({ page }) => {
    // Click through to start battle (adjust selectors as needed)
    // This is a template - adjust based on actual UI
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-planning-phase.png`,
      fullPage: true
    });
  });

  test('capture action menu open', async ({ page }) => {
    await page.waitForTimeout(500);
    // Try clicking a unit portrait to open action menu
    const portrait = page.locator('[data-testid="unit-portrait"]').first();
    if (await portrait.isVisible()) {
      await portrait.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-action-menu.png`,
      fullPage: true
    });
  });

  test('capture psynergy selection', async ({ page }) => {
    await page.waitForTimeout(500);
    // Look for psynergy/ability button
    const psynergyBtn = page.locator('text=Psynergy').first();
    if (await psynergyBtn.isVisible()) {
      await psynergyBtn.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-psynergy-menu.png`,
      fullPage: true
    });
  });

  test('capture target selection', async ({ page }) => {
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-target-selection.png`,
      fullPage: true
    });
  });

  test('capture execution phase', async ({ page }) => {
    // Look for execute/fight button
    const executeBtn = page.locator('text=Execute').or(page.locator('text=Fight'));
    if (await executeBtn.first().isVisible()) {
      await executeBtn.first().click();
      // Capture multiple frames during execution
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/06-execution-${i}.png`,
          fullPage: true
        });
      }
    }
  });
});
