import { test } from '@playwright/test';

test('Click tabs to check sprites', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  
  // Go to Compendium  
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  
  // Click each tab directly
  await page.screenshot({ path: '/tmp/vv2-screenshots/tab1-djinn.png' });
  
  await page.click('text=Unit Roster');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/tab2-units.png' });
  
  await page.click('text=Enemies');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/tab3-enemies.png' });
  
  await page.click('text=Equipment Catalog');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/tab4-equipment.png' });
});
