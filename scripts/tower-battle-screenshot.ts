/**
 * Tower Battle Screenshot - Simple verification script
 * Captures a single tower battle to verify sprites load correctly.
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('Tower Battle Screenshot Capture');
  console.log('================================\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Track 404 errors
  const errors404: string[] = [];
  page.on('response', response => {
    if (response.status() === 404 && response.url().includes('/sprites/')) {
      errors404.push(response.url());
    }
  });

  try {
    // Load game and pass title screen
    console.log('Loading game...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Find and click Battle Tower button
    console.log('Opening Battle Tower...');
    const towerBtn = page.locator('button').filter({ hasText: /tower/i });
    if (await towerBtn.count() === 0) {
      console.error('ERROR: Battle Tower button not found!');
      await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-error-no-button.png') });
      await browser.close();
      return;
    }
    await towerBtn.click();
    await page.waitForTimeout(2000);

    // Screenshot tower hub
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-hub.png') });
    console.log('Saved tower-hub.png');

    // Start Tower Run
    console.log('Starting Tower Run...');
    const startRunBtn = page.locator('button:has-text("Start Tower Run")');
    await startRunBtn.waitFor({ state: 'visible', timeout: 5000 });
    await startRunBtn.click();
    await page.waitForTimeout(2000);

    // Screenshot after starting run (should show Floor 1)
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-floor1-hub.png') });
    console.log('Saved tower-floor1-hub.png');

    // Begin Battle
    console.log('Beginning Floor 1 battle...');
    const beginBattleBtn = page.locator('button:has-text("Begin Battle")');
    try {
      await beginBattleBtn.waitFor({ state: 'visible', timeout: 10000 });
      await beginBattleBtn.click();
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Begin Battle button not visible - taking current state');
      await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-no-begin-battle.png') });
    }

    // Screenshot team select if shown
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-team-select.png') });
    console.log('Saved tower-team-select.png');

    // Start Battle if there's a Start Battle button
    const startBattleBtn = page.locator('button:has-text("Start Battle")');
    if (await startBattleBtn.count() > 0) {
      await startBattleBtn.click();
      await page.waitForTimeout(4000);
    }

    // Take battle screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-floor1-battle.png') });
    console.log('Saved tower-floor1-battle.png');

    // Report 404 errors
    console.log('\n================================');
    console.log('RESULTS');
    console.log('================================');
    if (errors404.length > 0) {
      console.log(`\n❌ 404 ERRORS (${errors404.length}):`);
      errors404.forEach(url => {
        const path = url.replace(BASE_URL, '');
        console.log(`   ${path}`);
      });
    } else {
      console.log('\n✅ No sprite 404 errors detected!');
    }

    console.log('\nScreenshots saved to public/screenshots/');
    console.log('Files: tower-hub.png, tower-floor1-hub.png, tower-team-select.png, tower-floor1-battle.png');

  } catch (error) {
    console.error('Error during capture:', error);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-error.png') });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
