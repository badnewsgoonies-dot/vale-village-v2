/**
 * Tower Battle Screenshot - Direct navigation
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('🏰 Tower Battle Screenshot Test\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Track 404s
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

  // Click Battle Tower directly from main menu
  console.log('🏰 Clicking Battle Tower...');
  const towerBtn = page.locator('button:has-text("BATTLE TOWER")');
  if (await towerBtn.count() > 0) {
    await towerBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-01-hub.png') });
    console.log('✅ tower-01-hub.png');
  } else {
    console.log('❌ Battle Tower button not found');
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-error-no-button.png') });
    await browser.close();
    return;
  }

  // Look for floor selection or start battle button
  const pageText = await page.locator('body').innerText();
  console.log('\n📋 Tower Hub content:');
  console.log(pageText.slice(0, 800));

  // Try to start floor 1
  const startBtn = page.locator('button:has-text("Start"), button:has-text("Begin"), button:has-text("Floor 1"), button:has-text("Enter")');
  if (await startBtn.count() > 0) {
    console.log('\n▶️ Starting battle...');
    await startBtn.first().click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-02-floor1-battle.png') });
    console.log('✅ tower-02-floor1-battle.png');
  }

  // Take final state screenshot
  await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-03-final.png'), fullPage: true });
  console.log('✅ tower-03-final.png');

  // Report 404s
  console.log('\n📊 404 Report:');
  if (notFoundUrls.length === 0) {
    console.log('✅ No missing resources!');
  } else {
    const sprites = notFoundUrls.filter(u => u.includes('/sprites/'));
    console.log(`⚠️ Missing sprites: ${sprites.length}`);
    sprites.slice(0, 15).forEach(url => console.log(`  - ${url.split('/sprites/')[1]}`));
    if (sprites.length > 15) console.log(`  ... and ${sprites.length - 15} more`);
  }

  await browser.close();
  console.log('\n✨ Done!');
}

main().catch(console.error);
