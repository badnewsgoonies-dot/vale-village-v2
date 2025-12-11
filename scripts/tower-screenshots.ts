/**
 * Tower Screenshot Script
 * Captures battle screenshots for Tower floors 1-5
 * Usage: npx tsx scripts/tower-screenshots.ts
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

async function captureFloorBattle(page: any, floorNumber: number): Promise<string> {
  const screenshotPath = join(SCREENSHOT_DIR, `tower-f${floorNumber}-battle.png`);

  console.log(`\n📸 Capturing Floor ${floorNumber}...`);

  try {
    // Navigate to home
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click "New Game" or "Continue" if available
    const newGameBtn = page.locator('button:has-text("New Game"), button:has-text("Start")');
    if (await newGameBtn.count() > 0) {
      await newGameBtn.first().click();
      await page.waitForTimeout(500);
    }

    // Look for Tower button on main menu
    const towerBtn = page.locator('button:has-text("Tower"), button:has-text("Battle Tower")');
    if (await towerBtn.count() > 0) {
      await towerBtn.first().click();
      await page.waitForTimeout(500);
    }

    // Look for floor selection or start button
    // Try to find floor number selector
    const floorSelector = page.locator(`[data-floor="${floorNumber}"], button:has-text("Floor ${floorNumber}")`);
    if (await floorSelector.count() > 0) {
      await floorSelector.first().click();
      await page.waitForTimeout(500);
    }

    // Start battle
    const startBattleBtn = page.locator('button:has-text("Start"), button:has-text("Battle"), button:has-text("Fight")');
    if (await startBattleBtn.count() > 0) {
      await startBattleBtn.first().click();
      await page.waitForTimeout(2000);
    }

    // Wait for battle scene to load
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    });

    console.log(`✅ Saved: ${screenshotPath}`);
    return screenshotPath;

  } catch (error) {
    console.error(`❌ Floor ${floorNumber} failed:`, error);

    // Take debug screenshot anyway
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `tower-f${floorNumber}-debug.png`),
      fullPage: true,
    });

    return '';
  }
}

async function main() {
  console.log('🎮 Tower Screenshot Capture Script');
  console.log('===================================');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`🔴 Console Error: ${msg.text()}`);
    }
  });

  // Track 404 errors
  const notFoundUrls: string[] = [];
  page.on('response', response => {
    if (response.status() === 404) {
      notFoundUrls.push(response.url());
      console.log(`⚠️ 404: ${response.url()}`);
    }
  });

  // First, let's just take a screenshot of current state
  console.log('\n📍 Navigating to game...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot current state
  await page.screenshot({
    path: join(SCREENSHOT_DIR, 'game-initial-state.png'),
    fullPage: true,
  });
  console.log('✅ Initial state captured');

  // Get page content to understand structure
  const pageTitle = await page.title();
  console.log(`📄 Page title: ${pageTitle}`);

  // Find all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log(`🔘 Available buttons: ${buttons.slice(0, 10).join(', ')}`);

  // Try to navigate to Battle Tower
  // Check if there's a dev mode toggle
  const devModeToggle = page.locator('[data-testid="dev-mode"], button:has-text("Dev"), .dev-mode-toggle');
  if (await devModeToggle.count() > 0) {
    console.log('🔧 Found dev mode toggle');
    await devModeToggle.first().click();
    await page.waitForTimeout(500);
  }

  // Look for Battle Tower entry
  const towerEntry = page.locator('button:has-text("Tower"), a:has-text("Tower"), [href*="tower"]');
  if (await towerEntry.count() > 0) {
    console.log('🏰 Found Tower entry');
    await towerEntry.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'tower-hub.png'),
      fullPage: true,
    });
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('===========');
  console.log(`404 errors found: ${notFoundUrls.length}`);
  if (notFoundUrls.length > 0) {
    console.log('Missing resources:');
    notFoundUrls.forEach(url => console.log(`  - ${url}`));
  }

  await browser.close();
  console.log('\n✨ Done!');
}

main().catch(console.error);
