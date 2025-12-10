import { test } from '@playwright/test';

test('Visual check - all screens', async ({ page }) => {
  await page.goto('/');
  
  // Title screen
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/vv2-screenshots/01-title.png' });
  
  // Menu
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/02-menu.png' });
  
  // Compendium
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/vv2-screenshots/03-compendium-djinn.png' });
  
  // Compendium - Units tab
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/04-compendium-units.png' });
  
  // Compendium - Enemies tab
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/05-compendium-enemies.png' });
  
  // Compendium - Equipment tab
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/vv2-screenshots/06-compendium-equipment.png' });
  
  // Back to menu
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Battle Tower
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/vv2-screenshots/07-tower-hub.png' });
  
  // Start tower run
  const startBtn = page.locator('button').filter({ hasText: /start tower run/i });
  if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/vv2-screenshots/08-tower-floor.png' });
    
    const beginBtn = page.locator('button').filter({ hasText: /begin battle/i });
    if (await beginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await beginBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '/tmp/vv2-screenshots/09-team-select.png' });
      
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/tmp/vv2-screenshots/10-battle.png' });
    }
  }
});
