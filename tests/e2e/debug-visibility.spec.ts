import { test } from '@playwright/test';

test('debug title visibility', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
  const locator = page.locator('.title-screen');
  const count = await locator.count();
  console.log('title-screen count:', count);
  if (count > 0) {
    const visible = await locator.first().isVisible();
    console.log('title-screen visible:', visible);
    const box = await locator.first().boundingBox();
    console.log('title-screen box:', box);
    const subtitle = await page.locator('.title-screen-subtitle').innerText().catch(()=>null);
    console.log('subtitle text:', subtitle);

    // Computed styles and viewport diagnostics
    const computedHeight = await page.evaluate(()=>{
      const el = document.querySelector('.title-screen');
      const cs = el ? getComputedStyle(el) : null;
      const screenContainer = document.querySelector('.screen-container');
      const ar = document.querySelector('.app-root');
      return {
        titleComputedHeight: cs ? cs.getPropertyValue('height') : null,
        screenContainerHeight: screenContainer ? getComputedStyle(screenContainer).getPropertyValue('height') : null,
        appRootHeight: ar ? getComputedStyle(ar).getPropertyValue('height') : null,
        clientHeight: document.documentElement.clientHeight,
        innerHeight: window.innerHeight,
      };
    });
    console.log('computed style and viewport:', computedHeight);
  }
});
