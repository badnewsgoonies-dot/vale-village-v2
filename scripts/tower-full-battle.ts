/**
 * Tower Full Battle Screenshot - Capture actual battle view
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('🏰 Tower Full Battle Screenshot\n');

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
  await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-prebattle.png') });
  console.log('✅ tower-f1-prebattle.png');

  // Click Begin Battle
  console.log('⚔️ Beginning Battle...');
  const beginBtn = page.locator('button:has-text("Begin Battle")');
  if (await beginBtn.count() > 0) {
    await beginBtn.click();
    await page.waitForTimeout(3000); // Wait for battle to load
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-battle.png') });
    console.log('✅ tower-f1-battle.png (BATTLE VIEW!)');

    // Wait a bit more and take another screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-f1-battle-2.png') });
    console.log('✅ tower-f1-battle-2.png');
  } else {
    console.log('❌ Begin Battle button not found');
  }

  // Report 404s (especially sprite 404s)
  console.log('\n📊 404 Report:');
  if (notFoundUrls.length === 0) {
    console.log('✅ No missing resources!');
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

    const other = notFoundUrls.filter(u => !u.includes('/sprites/') && !u.includes('/background'));
    if (other.length > 0) {
      console.log(`\n📁 Other Missing (${other.length}):`);
      other.forEach(url => console.log(`  - ${url}`));
    }
  }

  await browser.close();
  console.log('\n✨ Done!');
}

main().catch(console.error);
