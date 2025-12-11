/**
 * Screenshot Houses 1-3: Room and Battle views
 * Run with: npx tsx scripts/screenshot-houses.ts
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting Playwright screenshot capture...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Collect console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => errors.push(err.message));
  page.on('requestfailed', req => {
    if (req.url().includes('sprites') || req.url().includes('.png') || req.url().includes('.gif')) {
      errors.push(`404: ${req.url()}`);
    }
  });

  try {
    // Navigate to game
    console.log('Loading game...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await delay(2000);

    // Take initial screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'initial-load.png') });
    console.log('Saved initial-load.png');

    // Press any key to continue from title screen
    await page.keyboard.press('Enter');
    await delay(1500);

    // Check if we're at menu screen, click "New Game" if present
    const newGameButton = await page.$('button:has-text("New Game"), button:has-text("Start"), button:has-text("Continue")');
    if (newGameButton) {
      await newGameButton.click();
      await delay(1500);
    } else {
      // Try pressing Enter again
      await page.keyboard.press('Enter');
      await delay(1000);
    }

    // Take overworld screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'overworld.png') });
    console.log('Saved overworld.png');

    // For Houses 1-3, we need to navigate to each house
    // The game uses keyboard controls - try arrow keys and enter

    // House 1 - should be the first door
    console.log('Attempting to enter House 1...');

    // Press up to approach door
    await page.keyboard.press('ArrowUp');
    await delay(500);
    await page.keyboard.press('Enter');
    await delay(1000);

    // Screenshot house interior
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'house1-room.png') });
    console.log('Saved house1-room.png');

    // Approach NPC and start battle
    await page.keyboard.press('ArrowUp');
    await delay(300);
    await page.keyboard.press('ArrowUp');
    await delay(300);
    await page.keyboard.press('Enter'); // Talk to NPC
    await delay(1500);

    // Skip dialogue if any
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Enter');
      await delay(500);
    }

    // Screenshot battle view
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'house1-battle.png') });
    console.log('Saved house1-battle.png');

    // Print any 404 errors
    if (errors.length > 0) {
      console.log('\n=== ERRORS FOUND ===');
      errors.forEach(e => console.log(e));
    } else {
      console.log('\nNo 404 errors detected!');
    }

  } catch (error) {
    console.error('Error during screenshot capture:', error);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'error-state.png') });
  } finally {
    await browser.close();
  }

  console.log('\nDone! Screenshots saved to public/screenshots/');
}

main().catch(console.error);
