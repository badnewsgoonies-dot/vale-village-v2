/**
 * Screenshot Houses 4-6: Battle views via keyboard navigation
 * Run with: npx tsx scripts/screenshot-houses-4-6.ts
 */

import { chromium, Page } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function skipDialogues(page: Page, count: number = 10) {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Enter');
    await delay(300);
  }
}

async function captureHouseBattle(page: Page, houseNum: number, stepsRight: number, errors: string[]) {
  console.log(`\n=== House ${houseNum} ===`);

  // From spawn, move up to house row
  await page.keyboard.press('ArrowUp');
  await delay(200);

  // Move right to reach the target house
  for (let i = 0; i < stepsRight; i++) {
    await page.keyboard.press('ArrowRight');
    await delay(150);
  }

  // Enter the house door
  console.log(`Entering House ${houseNum}...`);
  await page.keyboard.press('Enter');
  await delay(1500);

  // Screenshot the room
  await page.screenshot({ path: join(SCREENSHOT_DIR, `house${houseNum}-room.png`) });
  console.log(`Saved house${houseNum}-room.png`);

  // Move up to NPC
  await page.keyboard.press('ArrowUp');
  await delay(200);
  await page.keyboard.press('ArrowUp');
  await delay(200);

  // Talk to NPC
  await page.keyboard.press('Enter');
  await delay(1000);

  // Skip through dialogues to get to battle
  await skipDialogues(page, 20);
  await delay(1500);

  // Screenshot the battle
  await page.screenshot({ path: join(SCREENSHOT_DIR, `house${houseNum}-battle.png`) });
  console.log(`Saved house${houseNum}-battle.png`);

  // Check for battle-view test id to confirm we're in battle
  const battleView = await page.$('[data-testid="battle-view"]');
  if (battleView) {
    console.log(`✅ House ${houseNum}: Battle view confirmed`);
  } else {
    console.log(`⚠️ House ${houseNum}: May not be in battle view`);
  }

  // Exit battle/house - press Escape for pause menu
  await page.keyboard.press('Escape');
  await delay(500);

  // Look for any exit/return button
  const exitBtn = await page.$('button:has-text("Exit"), button:has-text("Flee"), button:has-text("Return")');
  if (exitBtn) {
    await exitBtn.click();
    await delay(1000);
  }

  // Reload page to reset state for next house
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await delay(1500);

  // Re-enter game
  await page.keyboard.press('Enter');
  await delay(1000);
  const newGameBtn = await page.$('button:has-text("New Game"), button:has-text("Continue")');
  if (newGameBtn) {
    await newGameBtn.click();
    await delay(1000);
  } else {
    await page.keyboard.press('Enter');
    await delay(500);
  }
}

async function main() {
  console.log('Starting Playwright screenshot capture for Houses 4-6...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Collect console errors and 404s
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

    // Press any key to continue from title screen
    await page.keyboard.press('Enter');
    await delay(1500);

    // Click New Game if present
    const newGameButton = await page.$('button:has-text("New Game"), button:has-text("Start"), button:has-text("Continue")');
    if (newGameButton) {
      await newGameButton.click();
      await delay(1500);
    } else {
      await page.keyboard.press('Enter');
      await delay(1000);
    }

    // Take overworld screenshot
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'overworld-h4-6.png') });
    console.log('Saved overworld-h4-6.png');

    // House positions (steps right from spawn point)
    // Houses seem to be spaced ~3 tiles apart
    // House 1 = 0 steps, House 2 = 3 steps, House 3 = 6 steps, etc.
    await captureHouseBattle(page, 4, 9, errors);  // House 4 = 9 steps right
    await captureHouseBattle(page, 5, 12, errors); // House 5 = 12 steps right
    await captureHouseBattle(page, 6, 15, errors); // House 6 = 15 steps right

    // Print any 404 errors
    console.log('\n=== SUMMARY ===');
    if (errors.length > 0) {
      console.log('ERRORS FOUND:');
      errors.forEach(e => console.log(`  ${e}`));
    } else {
      console.log('No 404 errors detected!');
    }

  } catch (error) {
    console.error('Error during screenshot capture:', error);
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'error-state-h4-6.png') });
  } finally {
    await browser.close();
  }

  console.log('\nDone! Screenshots saved to public/screenshots/');
}

main().catch(console.error);
