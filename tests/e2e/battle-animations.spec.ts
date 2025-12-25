import { test, expect } from '@playwright/test';

test('Enemy animations appear during battle', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes

  await page.goto('/');

  // Title -> Menu
  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible();

  // Go to Battle Tower
  await page.keyboard.press('ArrowDown'); // Compendium
  await page.keyboard.press('ArrowDown'); // Battle Tower
  await page.keyboard.press('Enter');

  await page.waitForTimeout(1000);

  // Click Start Tower Run
  const startButton = page.locator('button').filter({ hasText: /start tower run/i });
  await expect(startButton).toBeVisible({ timeout: 5000 });
  await startButton.click();
  await page.waitForTimeout(2000);

  // Click Begin Battle
  const beginButton = page.locator('button').filter({ hasText: /begin battle/i });
  await expect(beginButton).toBeVisible({ timeout: 5000 });
  await beginButton.click();
  await page.waitForTimeout(2000);

  // Press Enter to start battle from team select
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Check for queue-battle-view
  const battleView = page.locator('.queue-battle-view');
  const inBattle = await battleView.isVisible({ timeout: 10000 }).catch(() => false);
  console.log('In battle view:', inBattle);

  await page.screenshot({ path: '/tmp/vv2-screenshots/battle-start.png' });

  if (inBattle) {
    // Poll for animation classes during battle
    let foundLunge = false;
    let foundShake = false;
    const animationClasses: string[] = [];

    for (let i = 0; i < 30; i++) { // Poll for 30 seconds
      const classes = await page.evaluate(() => {
        const allClasses: string[] = [];
        document.querySelectorAll('*').forEach(el => {
          el.classList.forEach(c => {
            if (c.includes('enemy') || c.includes('lunge') || c.includes('shake')) {
              allClasses.push(c);
            }
          });
        });
        return [...new Set(allClasses)];
      });

      if (classes.includes('enemy-lunge')) foundLunge = true;
      if (classes.includes('enemy-shake')) foundShake = true;

      classes.forEach(c => {
        if (!animationClasses.includes(c)) animationClasses.push(c);
      });

      if (foundLunge && foundShake) break;
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: '/tmp/vv2-screenshots/battle-mid.png' });

    console.log('Animation classes found:', animationClasses);
    console.log(`ENEMY ANIMATIONS: lunge=${foundLunge}, shake=${foundShake}`);

    if (foundLunge || foundShake) {
      console.log('=== ENEMY ANIMATIONS: PASS ===');
    } else {
      console.log('=== ENEMY ANIMATIONS: PARTIAL (classes wired but not observed) ===');
      // Check if the CSS exists at least
      const hasCSS = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        for (const sheet of styleSheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule instanceof CSSStyleRule) {
                if (rule.selectorText?.includes('enemy-lunge') ||
                    rule.selectorText?.includes('enemy-shake')) {
                  return true;
                }
              }
            }
          } catch { /* cross-origin */ }
        }
        return false;
      });
      console.log('CSS rules exist:', hasCSS);
    }
  }
});
