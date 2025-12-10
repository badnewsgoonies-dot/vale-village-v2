import { test } from '@playwright/test';
test('Equipment sprites check', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.click('text=Equipment Catalog');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/vv2-screenshots/equipment-new.png' });
});
