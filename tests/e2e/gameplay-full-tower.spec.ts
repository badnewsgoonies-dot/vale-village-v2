/**
 * Full Tower Run E2E Demo Test
 * Plays through all 30 floors of the Battle Tower with detailed logging
 */
import { test, expect } from '@playwright/test';
test.skip(!process.env.RUN_HEAVY, 'Skipping heavy e2e tests by default');
import * as fs from 'fs';
import { runBattle } from './helpers/battle';
import { dismissDialogueIfPresent } from './helpers/dialogue';
import { advanceToMainMenu } from './helpers/menu';
import { createDelay } from './helpers/timing';
import { handleRestFloor, startNextFloor, startTowerRun } from './helpers/tower';

const DEMO_MODE = process.env.DEMO_MODE === 'true';
const DELAY_MULTIPLIER = DEMO_MODE ? 3 : 1;
const DEFAULT_TIMEOUT = 10_000 * DELAY_MULTIPLIER;
const MAX_ROUNDS = 50;
const TOTAL_FLOORS = 30;
const delay = createDelay({ demoMode: DEMO_MODE, multiplier: DELAY_MULTIPLIER, fastCapMs: 100 });

interface FloorLog {
  floor: number;
  type: 'battle' | 'rest' | 'boss';
  startTime: number;
  endTime?: number;
  duration?: number;
  result?: 'victory' | 'defeat' | 'skipped';
  rounds?: number;
}

interface TowerRunLog {
  startTime: string;
  endTime?: string;
  totalDuration?: number;
  floorsCompleted: number;
  floors: FloorLog[];
  finalResult: 'completed' | 'defeat' | 'error';
  errorMessage?: string;
}

const runLog: TowerRunLog = {
  startTime: new Date().toISOString(),
  floorsCompleted: 0,
  floors: [],
  finalResult: 'error',
};

function logFloor(log: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${log}`);
}

function saveLog() {
  runLog.endTime = new Date().toISOString();
  if (runLog.startTime && runLog.endTime) {
    runLog.totalDuration = new Date(runLog.endTime).getTime() - new Date(runLog.startTime).getTime();
  }
  
  const logPath = `test-results/tower-run-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(runLog, null, 2));
  
  // Also write a readable summary
  const summaryPath = `test-results/tower-run-summary-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  let summary = `=== TOWER RUN SUMMARY ===\n`;
  summary += `Start: ${runLog.startTime}\n`;
  summary += `End: ${runLog.endTime}\n`;
  summary += `Total Duration: ${Math.round((runLog.totalDuration || 0) / 1000)}s\n`;
  summary += `Floors Completed: ${runLog.floorsCompleted}/${TOTAL_FLOORS}\n`;
  summary += `Final Result: ${runLog.finalResult}\n`;
  if (runLog.errorMessage) {
    summary += `Error: ${runLog.errorMessage}\n`;
  }
  summary += `\n=== FLOOR DETAILS ===\n`;
  for (const floor of runLog.floors) {
    summary += `Floor ${floor.floor} (${floor.type}): ${floor.result || 'unknown'} - ${floor.duration ? Math.round(floor.duration / 1000) + 's' : 'N/A'}`;
    if (floor.rounds) {
      summary += ` (${floor.rounds} rounds)`;
    }
    summary += `\n`;
  }
  fs.writeFileSync(summaryPath, summary);
  
  console.log(`\n📊 Log saved to: ${logPath}`);
  console.log(`📝 Summary saved to: ${summaryPath}`);
  console.log(summary);
}

test('Full Tower Run - Complete all 30 floors', async ({ page }) => {
  test.setTimeout(1800_000); // 30 minutes for full tower
  page.on('console', msg => console.log('BROWSER: ' + msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR: ' + err.message));

  logFloor('🏰 Starting Full Tower Run...');
  if (DEMO_MODE) {
    logFloor('📺 DEMO MODE: Running at 3x slower speed for better viewing');
  }

  try {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForSelector('canvas, #app, .game-root, [data-testid="game-root"]', { timeout: 5000 }).catch(() => {});
    await expect(page.locator('.title-screen')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await delay(page, 1000);

    await advanceToMainMenu(page, { timeoutMs: DEFAULT_TIMEOUT });
    await expect(page.locator('.main-menu')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await delay(page, 500);

    const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: /battle tower/i });
    await expect(battleTowerOption).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await battleTowerOption.click();
    await delay(page, 500);

    const towerHub = page.locator('.tower-hub');
    await expect(towerHub).toBeVisible({ timeout: 15_000 });
    await delay(page, 1000);

    // Start tower run
    await startTowerRun(page, { delay, delayMs: 500 });

    for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
      logFloor(`\n🏢 === FLOOR ${floor}/${TOTAL_FLOORS} ===`);
      
      const floorLog: FloorLog = {
        floor,
        type: 'battle',
        startTime: Date.now(),
      };

      // Start next floor
      const action = await startNextFloor(page, { delay, delayMs: 500 });
      logFloor(`  Action taken: ${action}`);

      // Check if this is a rest floor
      const restIndicator = page.locator('h2:has-text("Rest Floor")');
      if (await restIndicator.isVisible({ timeout: 1_000 }).catch(() => false)) {
        floorLog.type = 'rest';
        logFloor(`  🛏️ Rest floor - skipping`);
        await handleRestFloor(page, { delay, delayMs: 500 });
        floorLog.result = 'skipped';
        floorLog.endTime = Date.now();
        floorLog.duration = floorLog.endTime - floorLog.startTime;
        runLog.floors.push(floorLog);
        runLog.floorsCompleted = floor;
        continue;
      }

      // Check for prebattle screen
      const teamSelect = page.locator('.prebattle-v2-overlay');
      const battleView = page.locator('[data-testid="battle-view"]');
      
      if (await teamSelect.waitFor({ state: "visible", timeout: 10_000 }).then(() => true).catch(() => false)) {
        logFloor(`  👥 Team select screen - confirming`);
        await page.keyboard.press('Enter');
        await delay(page, 1000);
      }

      // Check if battle started
      if (await battleView.waitFor({ state: "visible", timeout: 15_000 }).then(() => true).catch(() => false)) {
        logFloor(`  ⚔️ Battle started`);
        
        // Determine if boss floor
        if (floor % 6 === 0 || floor === 30) {
          floorLog.type = 'boss';
          logFloor(`  👹 BOSS FLOOR!`);
        }
        
        const battleResult = await runBattle(page, {
          delay,
          maxRounds: MAX_ROUNDS,
          forceClicks: true,
          actionTimeoutMs: DEFAULT_TIMEOUT, waitTimeoutMs: 120_000,
          onRoundExecuted: (round) => logFloor(`  Floor ${floor} - Round ${round} executed`),
        });
        floorLog.result = battleResult.result;
        floorLog.rounds = battleResult.rounds;
        
        if (battleResult.result === 'defeat') {
          logFloor(`  ❌ DEFEATED on floor ${floor}!`);
          floorLog.endTime = Date.now();
          floorLog.duration = floorLog.endTime - floorLog.startTime;
          runLog.floors.push(floorLog);
          runLog.finalResult = 'defeat';
          saveLog();
          throw new Error(`Defeated on floor ${floor}`);
        }
        
        logFloor(`  ✅ Victory! (${battleResult.rounds} rounds)`);
        
        // Collect rewards
        await page.keyboard.press('Enter');
        await delay(page, 500);
      } else {
        logFloor(`  ⏭️ Floor skipped (no battle view)`);
        floorLog.result = 'skipped';
      }

      floorLog.endTime = Date.now();
      floorLog.duration = floorLog.endTime - floorLog.startTime;
      runLog.floors.push(floorLog);
      runLog.floorsCompleted = floor;

      // Wait for tower hub
      await expect(towerHub).toBeVisible({ timeout: 20_000 });
      await dismissDialogueIfPresent(page, {
        delay,
        overlayTimeoutMs: 500,
        stepTimeoutMs: 200,
        stepDelayMs: 300,
        maxSteps: 40,
      });
      await delay(page, 500);
    }

    runLog.finalResult = 'completed';
    logFloor(`\n🎉🎉🎉 TOWER COMPLETE! All ${TOTAL_FLOORS} floors cleared! 🎉🎉🎉`);
    
  } catch (error) {
    runLog.errorMessage = error instanceof Error ? error.message : String(error);
    if (runLog.finalResult !== 'defeat') {
      runLog.finalResult = 'error';
    }
    throw error;
  } finally {
    saveLog();
  }
});
