import { test, expect } from '@playwright/test';

// Minimal smoke test: boot the app and assert the main canvas is present
test('Boot: game canvas is visible', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas.first()).toBeVisible({ timeout: 10000 });
});
