/**
 * Tower Screenshot Script v2
 * Captures battle screenshots for Tower floors 1-5
 * Handles title screen and navigation properly
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('🎮 Tower Screenshot Capture Script v2');
  console.log('=====================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Track 404 errors
  const notFoundUrls: string[] = [];
  page.on('response', response => {
    if (response.status() === 404) {
      notFoundUrls.push(response.url());
    }
  });

  // Navigate to game
  console.log('📍 Navigating to game...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Screenshot title screen
  await page.screenshot({ path: join(SCREENSHOT_DIR, '01-title-screen.png') });
  console.log('✅ 01-title-screen.png');

  // Press any key to continue (click or press key)
  console.log('🔑 Pressing key to continue...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  // Screenshot main menu
  await page.screenshot({ path: join(SCREENSHOT_DIR, '02-main-menu.png') });
  console.log('✅ 02-main-menu.png');

  // Look for all visible text and buttons
  const allText = await page.locator('body').innerText();
  console.log('\n📋 Page content preview:');
  console.log(allText.slice(0, 500));

  // Try to find New Game button
  const newGameBtn = page.locator('button:has-text("New Game"), button:has-text("Start"), button:has-text("Play")');
  if (await newGameBtn.count() > 0) {
    console.log('\n🎮 Found New Game button, clicking...');
    await newGameBtn.first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, '03-after-new-game.png') });
    console.log('✅ 03-after-new-game.png');
  }

  // Check for Continue button
  const continueBtn = page.locator('button:has-text("Continue")');
  if (await continueBtn.count() > 0) {
    console.log('\n▶️ Found Continue button, clicking...');
    await continueBtn.first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, '03-after-continue.png') });
    console.log('✅ 03-after-continue.png');
  }

  // Look for Tower/Arena entry
  const towerBtn = page.locator('button:has-text("Tower"), button:has-text("Arena"), button:has-text("Battle Tower"), [data-screen="tower"]');
  if (await towerBtn.count() > 0) {
    console.log('\n🏰 Found Tower button, clicking...');
    await towerBtn.first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(SCREENSHOT_DIR, '04-tower-hub.png') });
    console.log('✅ 04-tower-hub.png');
  }

  // Try navigating via URL hash if available
  console.log('\n🔗 Trying direct URL navigation...');
  await page.goto(`${BASE_URL}/#tower`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(SCREENSHOT_DIR, '05-tower-via-url.png') });
  console.log('✅ 05-tower-via-url.png');

  // Check current page state
  const currentUrl = page.url();
  console.log(`\n📍 Current URL: ${currentUrl}`);

  // Look for any battle-related elements
  const battleElements = await page.locator('[class*="battle"], [class*="Battle"], [data-testid*="battle"]').count();
  console.log(`🎯 Battle elements found: ${battleElements}`);

  // Final screenshot of whatever state we're in
  await page.screenshot({ path: join(SCREENSHOT_DIR, '06-final-state.png'), fullPage: true });
  console.log('✅ 06-final-state.png (full page)');

  // Summary
  console.log('\n📊 404 Errors Summary');
  console.log('=====================');
  if (notFoundUrls.length === 0) {
    console.log('✅ No 404 errors detected!');
  } else {
    console.log(`⚠️ ${notFoundUrls.length} resources not found:`);
    // Group by type
    const spriteErrors = notFoundUrls.filter(u => u.includes('/sprites/'));
    const otherErrors = notFoundUrls.filter(u => !u.includes('/sprites/'));

    if (spriteErrors.length > 0) {
      console.log(`\n🖼️ Missing Sprites (${spriteErrors.length}):`);
      spriteErrors.slice(0, 20).forEach(url => {
        const path = url.replace(BASE_URL, '');
        console.log(`  - ${path}`);
      });
      if (spriteErrors.length > 20) {
        console.log(`  ... and ${spriteErrors.length - 20} more`);
      }
    }

    if (otherErrors.length > 0) {
      console.log(`\n📁 Other Missing Resources (${otherErrors.length}):`);
      otherErrors.forEach(url => console.log(`  - ${url.replace(BASE_URL, '')}`));
    }
  }

  await browser.close();
  console.log('\n✨ Done! Check public/screenshots/ for results.');
}

main().catch(console.error);
