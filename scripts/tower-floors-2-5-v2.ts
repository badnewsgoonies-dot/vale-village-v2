/**
 * Tower Floors 2-5 Screenshot Script v2
 * More robust - executes battles via Attack action
 */

import { chromium, Page } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = join(__dirname, '../public/screenshots');
const BASE_URL = 'http://localhost:5173';

interface FloorResult {
  floor: number;
  type: 'battle' | 'rest';
  screenshotPath: string;
  sprite404s: string[];
}

async function waitAndClick(page: Page, selector: string, timeout = 5000): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.locator(selector).first().click();
    return true;
  } catch {
    return false;
  }
}

async function executeBattleTurns(page: Page, maxTurns = 30): Promise<void> {
  console.log('    Executing battle...');
  for (let turn = 0; turn < maxTurns; turn++) {
    // Check if battle ended (victory/defeat overlay)
    const hasVictory = await page.locator('[class*="victory"], [class*="Victory"]').count() > 0;
    const hasDefeat = await page.locator('[class*="defeat"], [class*="Defeat"]').count() > 0;
    if (hasVictory || hasDefeat) {
      console.log(`    Battle ended after ${turn} turns`);
      return;
    }

    // Try to click Attack button
    const attackBtn = page.locator('button:has-text("ATTACK"), button:has-text("Attack")');
    if (await attackBtn.count() > 0) {
      await attackBtn.first().click();
      await page.waitForTimeout(300);

      // Select first target (enemy)
      const targetBtns = page.locator('button[data-target], [class*="target"], .enemy-target');
      if (await targetBtns.count() > 0) {
        await targetBtns.first().click();
      }
      await page.waitForTimeout(500);
    }

    // Check for "End Turn" or "Execute" button
    const endTurnBtn = page.locator('button:has-text("End Turn"), button:has-text("Execute"), button:has-text("GO")');
    if (await endTurnBtn.count() > 0) {
      await endTurnBtn.first().click();
      await page.waitForTimeout(1500);
    }

    // Wait a bit for animations
    await page.waitForTimeout(500);
  }
}

async function handlePostBattle(page: Page): Promise<void> {
  // Handle victory/rewards screens
  await page.waitForTimeout(1000);

  // Click through any dialogs/rewards
  for (let i = 0; i < 5; i++) {
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("OK"), button:has-text("Next"), button:has-text("Collect"), button:has-text("Done"), button:has-text("Proceed")');
    if (await continueBtn.count() > 0) {
      await continueBtn.first().click();
      await page.waitForTimeout(1000);
    } else {
      break;
    }
  }
}

async function main() {
  console.log('Tower Floors 2-5 Screenshot Script v2');
  console.log('=====================================\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const results: FloorResult[] = [];
  let current404s: string[] = [];

  page.on('response', response => {
    if (response.status() === 404 && response.url().includes('/sprites/')) {
      current404s.push(response.url().replace(BASE_URL, ''));
    }
  });

  // Navigate
  console.log('Loading game...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Battle Tower
  console.log('Opening Battle Tower...');
  await waitAndClick(page, 'button:has-text("BATTLE TOWER")');
  await page.waitForTimeout(1500);

  // Start Run
  console.log('Starting Tower Run...\n');
  await waitAndClick(page, 'button:has-text("Start Tower Run")');
  await page.waitForTimeout(1500);

  // Process floors 1-5
  for (let floor = 1; floor <= 5; floor++) {
    current404s = [];
    console.log(`\n=== FLOOR ${floor} ===`);

    // Check current floor type
    const pageText = await page.locator('body').innerText();
    const isRestFloor = pageText.includes('Rest Floor') || (await page.locator('.floor-pill.rest').count() > 0);

    if (isRestFloor) {
      console.log('  Type: REST');
      const screenshotPath = join(SCREENSHOT_DIR, `tower-f${floor}-rest.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`  Screenshot: tower-f${floor}-rest.png`);

      results.push({ floor, type: 'rest', screenshotPath, sprite404s: [] });

      // Take rest
      await waitAndClick(page, 'button:has-text("Take Rest")');
      await page.waitForTimeout(1500);
      continue;
    }

    console.log('  Type: BATTLE');

    // Begin Battle
    await waitAndClick(page, 'button:has-text("Begin Battle")');
    await page.waitForTimeout(2000);

    // Start Battle (from team select)
    await waitAndClick(page, 'button:has-text("Start Battle")');
    await page.waitForTimeout(3000);

    // Take battle screenshot
    const screenshotPath = join(SCREENSHOT_DIR, `tower-f${floor}-battle.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`  Screenshot: tower-f${floor}-battle.png`);

    results.push({ floor, type: 'battle', screenshotPath, sprite404s: [...current404s] });

    // Execute battle
    await executeBattleTurns(page);

    // Handle post-battle
    await handlePostBattle(page);

    // Wait for return to tower hub
    await page.waitForTimeout(2000);
  }

  // Final report
  console.log('\n\n========================================');
  console.log('RESULTS SUMMARY');
  console.log('========================================\n');

  for (const result of results) {
    console.log(`Floor ${result.floor}:`);
    console.log(`  Type: ${result.type.toUpperCase()}`);
    console.log(`  Screenshot: ${result.screenshotPath.split('/').pop()}`);
    if (result.sprite404s.length > 0) {
      console.log(`  Missing sprites (${result.sprite404s.length}):`);
      result.sprite404s.slice(0, 5).forEach(s => console.log(`    - ${s}`));
      if (result.sprite404s.length > 5) console.log(`    ... and ${result.sprite404s.length - 5} more`);
    }
    console.log('');
  }

  // Check battle screenshots
  const battleResults = results.filter(r => r.type === 'battle');
  console.log('========================================');
  console.log('BACKGROUND CHECK');
  console.log('========================================');
  console.log('Note: Background is currently hardcoded to Kolima_Forest.gif in QueueBattleView.tsx:1037');
  console.log('All battle floors should show the same forest background.\n');

  await browser.close();
  console.log('Done! Screenshots in public/screenshots/');
}

main().catch(console.error);
