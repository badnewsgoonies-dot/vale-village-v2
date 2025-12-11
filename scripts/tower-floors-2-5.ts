/**
 * Tower Floors 2-5 Screenshot Script
 * Captures battle screenshots for Tower floors 2-5 to verify background rotation.
 * Floor 4 is a rest floor (no battle), so we capture floors 2, 3, 5.
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

interface FloorReport {
  floor: number;
  background: string | null;
  playerSprites: string[];
  enemySprites: string[];
  errors404: string[];
}

async function main() {
  console.log('Tower Floors 2-5 Screenshot Capture');
  console.log('====================================\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Track 404 errors per floor
  let current404s: string[] = [];
  page.on('response', response => {
    if (response.status() === 404) {
      current404s.push(response.url());
    }
  });

  const reports: FloorReport[] = [];

  // Navigate and pass title screen
  console.log('Loading game...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Press Enter to dismiss title screen
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  // Look for Battle Tower button (case insensitive)
  console.log('Opening Battle Tower...');
  let towerBtn = page.locator('button:has-text("BATTLE TOWER")');
  if (await towerBtn.count() === 0) {
    // Try alternate casing
    towerBtn = page.locator('button:has-text("Battle Tower")');
  }
  if (await towerBtn.count() === 0) {
    // Try contains match
    towerBtn = page.locator('button').filter({ hasText: /tower/i });
  }
  if (await towerBtn.count() === 0) {
    console.error('ERROR: Battle Tower button not found!');
    await page.screenshot({ path: join(SCREENSHOT_DIR, 'tower-floors-error.png') });
    console.log('Current page screenshot saved for debugging');
    await browser.close();
    return;
  }
  await towerBtn.click();
  await page.waitForTimeout(2000);

  // Start Tower Run
  console.log('Starting Tower Run...');
  const startRunBtn = page.locator('button:has-text("Start Tower Run")');
  await startRunBtn.waitFor({ state: 'visible', timeout: 5000 });
  await startRunBtn.click();
  await page.waitForTimeout(2000);

  // Tower floor definitions (from towerFloors.ts):
  // Floor 1: vs1-garet (tutorial)
  // Floor 2: house-02 (normal)
  // Floor 3: house-03 (normal)
  // Floor 4: rest floor
  // Floor 5: house-04 (normal)

  // We'll complete floors 1-5, taking screenshots of battles
  for (let floor = 1; floor <= 5; floor++) {
    current404s = []; // Reset 404s for this floor

    console.log(`\n--- Floor ${floor} ---`);

    // Check if we're on a rest floor
    const isRest = await page.locator('.floor-pill.rest').count() > 0;

    if (isRest) {
      console.log(`Floor ${floor} is a REST floor - no battle`);
      await page.screenshot({ path: join(SCREENSHOT_DIR, `tower-floor-${floor}-rest.png`) });
      // Take rest
      await page.locator('button:has-text("Take Rest")').click();
      await page.waitForTimeout(1500);
      continue;
    }

    // Begin Battle
    console.log(`Beginning battle for floor ${floor}...`);
    const beginBattleBtn = page.locator('button:has-text("Begin Battle")');
    try {
      await beginBattleBtn.waitFor({ state: 'visible', timeout: 10000 });
      await beginBattleBtn.click();
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`  ERROR: Begin Battle button not visible for floor ${floor}`);
      await page.screenshot({ path: join(SCREENSHOT_DIR, `tower-floor-${floor}-no-button.png`) });
      continue;
    }

    // Take team select screenshot for floors 2-5
    if (floor >= 2) {
      await page.screenshot({ path: join(SCREENSHOT_DIR, `tower-floor-${floor}-team-select.png`) });
      console.log(`  -> tower-floor-${floor}-team-select.png`);
    }

    // Start Battle
    const startBtn = page.locator('button:has-text("Start Battle")');
    if (await startBtn.count() > 0) {
      await startBtn.click();
      await page.waitForTimeout(4000); // Wait for battle to load fully

      // Capture battle screenshot for floors 2-5
      if (floor >= 2 && floor <= 5) {
        await page.screenshot({ path: join(SCREENSHOT_DIR, `tower-floor-${floor}-battle.png`) });
        console.log(`  -> tower-floor-${floor}-battle.png`);

        // Try to extract sprite info from the page
        const report = await extractFloorReport(page, floor, current404s);
        reports.push(report);
      }

      // Just take the battle screenshot - don't try to auto-complete
      // The screenshot already captured above shows the battle state
      console.log(`  Battle screenshot captured - skipping auto-battle (manual verification needed)`);

      // Take a final screenshot showing battle UI state
      await page.waitForTimeout(2000);
      await page.screenshot({ path: join(SCREENSHOT_DIR, `tower-floor-${floor}-battle-state.png`) });

      // For this verification, we just need to see that sprites load
      // Return to tower hub by reloading the page
      console.log(`  Reloading to continue to next floor...`);
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      // Re-enter tower mode
      let towerBtnLoop = page.locator('button').filter({ hasText: /tower/i });
      if (await towerBtnLoop.count() > 0) {
        await towerBtnLoop.click();
        await page.waitForTimeout(2000);

        // If we have an existing run, it should show current floor
        // If not, start a new run
        const startRunBtn = page.locator('button:has-text("Start Tower Run")');
        if (await startRunBtn.count() > 0) {
          await startRunBtn.click();
          await page.waitForTimeout(2000);
        }
      }

      // Click Continue/Proceed if available
      const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Proceed"), button:has-text("OK")');
      if (await continueBtn.count() > 0) {
        await continueBtn.first().click();
        await page.waitForTimeout(2000);
      }

      // Handle rewards screen if present
      const collectBtn = page.locator('button:has-text("Collect"), button:has-text("Next"), button:has-text("Done")');
      if (await collectBtn.count() > 0) {
        await collectBtn.first().click();
        await page.waitForTimeout(1500);
      }
    } else {
      console.log(`  ERROR: Start Battle button not found for floor ${floor}`);
    }
  }

  // Print summary report
  console.log('\n\n====================================');
  console.log('FLOOR REPORTS');
  console.log('====================================\n');

  for (const report of reports) {
    console.log(`Floor ${report.floor}:`);
    console.log(`  Background: ${report.background || 'hardcoded (Kolima_Forest.gif)'}`);
    console.log(`  Player sprites: ${report.playerSprites.length > 0 ? report.playerSprites.join(', ') : 'N/A'}`);
    console.log(`  Enemy sprites: ${report.enemySprites.length > 0 ? report.enemySprites.join(', ') : 'N/A'}`);
    if (report.errors404.length > 0) {
      console.log(`  404 Errors (${report.errors404.length}):`);
      report.errors404.slice(0, 5).forEach(url => {
        const path = url.replace(BASE_URL, '');
        console.log(`    - ${path}`);
      });
      if (report.errors404.length > 5) {
        console.log(`    ... and ${report.errors404.length - 5} more`);
      }
    } else {
      console.log(`  404 Errors: None`);
    }
    console.log('');
  }

  // Check if backgrounds varied
  const backgrounds = reports.map(r => r.background).filter(Boolean);
  const uniqueBackgrounds = [...new Set(backgrounds)];
  console.log('====================================');
  console.log('BACKGROUND ROTATION CHECK');
  console.log('====================================');
  if (uniqueBackgrounds.length > 1) {
    console.log(`Backgrounds DO vary between floors!`);
    console.log(`Unique backgrounds: ${uniqueBackgrounds.join(', ')}`);
  } else if (uniqueBackgrounds.length === 1) {
    console.log(`All floors use the SAME background: ${uniqueBackgrounds[0]}`);
  } else {
    console.log(`Background appears to be hardcoded to Kolima_Forest.gif (no dynamic backgrounds detected)`);
  }

  await browser.close();
  console.log('\nDone! Check public/screenshots/ for results.');
}

async function extractFloorReport(page: import('playwright').Page, floor: number, errors404: string[]): Promise<FloorReport> {
  // Try to extract background from computed style
  let background: string | null = null;
  try {
    background = await page.evaluate(() => {
      // Look for background image in any element
      const elements = document.querySelectorAll('[style*="background"]');
      for (const el of elements) {
        const style = (el as HTMLElement).style.backgroundImage;
        if (style && style.includes('/sprites/backgrounds/')) {
          return style;
        }
      }
      return null;
    });
  } catch {
    // Ignore extraction errors
  }

  // Try to extract sprite sources
  const playerSprites: string[] = [];
  const enemySprites: string[] = [];
  try {
    const sprites = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => img.src).filter(src => src.includes('/sprites/'));
    });

    for (const sprite of sprites) {
      if (sprite.includes('/player/') || sprite.includes('/heroes/')) {
        playerSprites.push(sprite.split('/').pop() || sprite);
      } else if (sprite.includes('/enemies/') || sprite.includes('/enemy/')) {
        enemySprites.push(sprite.split('/').pop() || sprite);
      }
    }
  } catch {
    // Ignore extraction errors
  }

  return {
    floor,
    background,
    playerSprites,
    enemySprites,
    errors404: errors404.filter(url => url.includes('/sprites/')),
  };
}

main().catch(console.error);
