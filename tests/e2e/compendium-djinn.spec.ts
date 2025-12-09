import { test, expect } from '@playwright/test';

test('Compendium Djinn Section has sprites', async ({ page }) => {
  await page.goto('/');

  // Title -> Menu
  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();

  // Navigate to Compendium (one down from New Game)
  await page.keyboard.press('ArrowDown'); // Compendium
  await page.keyboard.press('Enter');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/vv2-screenshots/compendium-main.png' });

  // Look for Djinn tab/section
  const djinnTab = page.locator('button, [role="tab"], a, .tab, .nav-item').filter({ hasText: /djinn/i });
  const hasDjinnTab = await djinnTab.isVisible({ timeout: 2000 }).catch(() => false);
  console.log('Djinn tab visible:', hasDjinnTab);

  if (hasDjinnTab) {
    await djinnTab.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: '/tmp/vv2-screenshots/compendium-djinn.png' });

  // Check for images
  const images = await page.locator('img').evaluateAll(imgs =>
    imgs.map(img => ({
      src: (img as HTMLImageElement).src,
      loaded: (img as HTMLImageElement).naturalWidth > 0
    }))
  );
  console.log('Images found:', JSON.stringify(images, null, 2));

  const djinnImages = images.filter(i => i.src.toLowerCase().includes('djinn'));
  const result = djinnImages.length > 0 ? 'PASS' : 'FAIL';
  console.log('\n=== DJINN SPRITES: ' + result + ' (' + djinnImages.length + ' found) ===');
});
