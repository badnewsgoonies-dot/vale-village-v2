import { test, expect } from '@playwright/test';

// Minimal smoke test: boot the app and assert the main canvas is present
test('Boot: game canvas is visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
  const canvas = page.locator('canvas');
  await expect(canvas.first()).toBeVisible({ timeout: 10000 });
});
