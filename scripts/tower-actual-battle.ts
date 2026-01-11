/**
 * Tower Actual Battle Screenshot - Get into the real battle view
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('🏰 Tower ACTUAL Battle Screenshot\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Track 404s for sprites
  const notFoundUrls: string[] = [];
  page.on('response', response => {
    if (response.status() === 404) {
      notFoundUrls.push(response.url());
    }
  });

  // Navigate and press Enter to pass title screen
  console.log('📍 Loading game...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Click Battle Tower
  console.log('🏰 Opening Battle Tower...');
  await page.locator('button:has-text("BATTLE TOWER")').click();
  await page.waitForTimeout(1500);

  // Click Start Tower Run
  console.log('▶️ Starting Tower Run...');
  await page.locator('button:has-text("Start Tower Run")').click();
  await page.waitForTimeout(1500);

  // Click Begin Battle
  console.log('⚔️ Beginning Battle (floor select)...');
  await page.locator('button:has-text("Begin Battle")').click();
  await page.waitForTimeout(2000);

  // Now we're at team select - screenshot it
  await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-team-select.png') });
  console.log('✅ tower-f1-team-select.png');

  // Click Start Battle to start actual battle
  console.log('🎮 Clicking Start Battle...');
  const enterBtn = page.locator('button:has-text("Start Battle")');
  if (await enterBtn.count() > 0) {
    await enterBtn.click();
    await page.waitForTimeout(4000); // Wait for battle scene to fully load

    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-BATTLE.png') });
    console.log('✅ tower-f1-BATTLE.png (THE ACTUAL BATTLE!)');

    // Take a few more to capture any animations
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-BATTLE-2.png') });
    console.log('✅ tower-f1-BATTLE-2.png');

  } else {
    console.log('❌ Enter button not found');
    const btns = await page.locator('button').allTextContents();
    console.log('Available buttons:', btns);
  }

  // Report 404s (especially sprite 404s)
  console.log('\n📊 404 Report:');
  if (notFoundUrls.length === 0) {
    console.log('✅ NO MISSING RESOURCES - All sprites loaded!');
  } else {
    const sprites = notFoundUrls.filter(u => u.includes('/sprites/'));
    const backgrounds = notFoundUrls.filter(u => u.includes('/background'));

    if (sprites.length > 0) {
      console.log(`\n🖼️ Missing Sprites (${sprites.length}):`);
      sprites.slice(0, 20).forEach(url => {
        const path = url.split('/sprites/')[1] || url;
        console.log(`  - /sprites/${path}`);
      });
      if (sprites.length > 20) console.log(`  ... and ${sprites.length - 20} more`);
    }

    if (backgrounds.length > 0) {
      console.log(`\n🎨 Missing Backgrounds (${backgrounds.length}):`);
      backgrounds.forEach(url => console.log(`  - ${url}`));
    }
  }

  await browser.close();
  console.log('\n✨ Done!');
}

main().catch(console.error);
