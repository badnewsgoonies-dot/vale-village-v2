import { chromium } from 'playwright';

async function debugGame() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  console.log('Navigating to game...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);

  // Screenshot title screen
  await page.screenshot({ path: '/tmp/01-title-screen.png' });
  console.log('Screenshot: /tmp/01-title-screen.png');

  // Check console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR:', msg.text());
    }
  });

  // Click anywhere to advance from title screen
  await page.click('body');
  await page.waitForTimeout(1500);

  // Screenshot main menu
  await page.screenshot({ path: '/tmp/02-main-menu.png' });
  console.log('Screenshot: /tmp/02-main-menu.png');

  // Click Compendium
  await page.click('text=Compendium');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/03-compendium.png' });
  console.log('Screenshot: /tmp/03-compendium.png');

  // Close compendium
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Start new game
  await page.click('text=New Game');
  await page.waitForTimeout(3000); // Wait for transition

  // Screenshot overworld
  await page.screenshot({ path: '/tmp/04-overworld.png' });
  console.log('Screenshot: /tmp/04-overworld.png');

  // Try to enter a house (press space)
  console.log('Attempting to enter house (Space key)...');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/05-after-space.png' });
  console.log('Screenshot: /tmp/05-after-space.png');

  // Move around
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/06-moved-right.png' });
  console.log('Screenshot: /tmp/06-moved-right.png');

  // Get canvas rendering info
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { found: false };

    return {
      found: true,
      width: canvas.width,
      height: canvas.height,
      style: canvas.style.cssText,
    };
  });
  console.log('Canvas info:', canvasInfo);

  // Get layer z-indices from engine
  const layerInfo = await page.evaluate(() => {
    // @ts-ignore
    const engine = window.__overworldEngine;
    if (!engine) return { found: false };

    return {
      found: true,
      layers: engine.layers?.map((l: any) => ({
        name: l.constructor.name,
        zIndex: l.zIndex,
      })),
    };
  });
  console.log('Layer info:', layerInfo);

  console.log('\nScreenshots saved to /tmp/');
  console.log('Closing browser...');
  await browser.close();
  console.log('Done!');
}

debugGame().catch(console.error);
