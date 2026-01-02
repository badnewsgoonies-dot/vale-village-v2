/**
 * Full Tower Run E2E Demo Test
 * Plays through all 30 floors of the Battle Tower with detailed logging
 */
import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';

const DEMO_MODE = process.env.DEMO_MODE === 'true';
const DELAY_MULTIPLIER = DEMO_MODE ? 3 : 1;
const DEFAULT_TIMEOUT = 10_000 * DELAY_MULTIPLIER;
const MAX_ROUNDS = 50;
const TOTAL_FLOORS = 30;

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

async function demoDelay(page: Page, ms: number) {
  if (DEMO_MODE) {
    await page.waitForTimeout(ms * DELAY_MULTIPLIER);
  } else {
    await page.waitForTimeout(Math.min(ms, 100));
  }
}

async function dismissDialogueIfPresent(page: Page) {
  const chatOverlay = page.locator('.dialogue-chat-overlay');
  if (!(await chatOverlay.isVisible({ timeout: 500 }).catch(() => false))) return;

  for (let i = 0; i < 40; i++) {
    if (!(await chatOverlay.isVisible({ timeout: 200 }).catch(() => false))) return;

    const choice = page.locator('.dialogue-chat-choice').first();
    if (await choice.isVisible({ timeout: 200 }).catch(() => false)) {
      await choice.click();
      await demoDelay(page, 300);
      continue;
    }

    const nextButton = page.locator('.dialogue-chat-next');
    if (await nextButton.isVisible({ timeout: 200 }).catch(() => false)) {
      await nextButton.click();
      await demoDelay(page, 300);
      continue;
    }

    await page.keyboard.press('Space');
    await demoDelay(page, 300);
  }
}

async function advancePostBattleCutscene(page: Page) {
  const cutscene = page.locator('.post-battle-cutscene');
  if (!(await cutscene.isVisible({ timeout: 500 }).catch(() => false))) return false;

  const advanceButton = cutscene.locator('.cutscene-button');
  for (let i = 0; i < 8; i++) {
    if (!(await cutscene.isVisible({ timeout: 300 }).catch(() => false))) return true;
    if (await advanceButton.isVisible({ timeout: 300 }).catch(() => false)) {
      await advanceButton.click();
    } else {
      await page.keyboard.press('Enter');
    }
    await demoDelay(page, 300);
  }

  return true;
}

async function advanceVictoryOverlay(page: Page) {
  const victoryOverlay = page.locator('.victory-overlay');
  if (!(await victoryOverlay.isVisible({ timeout: 500 }).catch(() => false))) return false;

  const continueButton = victoryOverlay.locator('.victory-continue-btn');
  if (await continueButton.isVisible({ timeout: 500 }).catch(() => false)) {
    await continueButton.click();
    await demoDelay(page, 500);
    return true;
  }

  const genericContinue = victoryOverlay.locator('button').filter({ hasText: /continue/i }).first();
  if (await genericContinue.isVisible({ timeout: 500 }).catch(() => false)) {
    await genericContinue.click();
    await demoDelay(page, 500);
    return true;
  }

  await page.keyboard.press('Enter');
  await demoDelay(page, 500);
  return true;
}

async function waitForBattleStep(page: Page) {
  const rewardsScreen = page.locator('.rewards-screen');
  const cutscene = page.locator('.post-battle-cutscene');
  const victoryOverlay = page.locator('.victory-overlay');
  const defeatOverlay = page.locator('.defeat-overlay');
  const executeButton = page.locator('[data-testid="battle-execute-round"]');

  const startedAt = Date.now();
  while (Date.now() - startedAt < 25_000) {
    if (await rewardsScreen.isVisible({ timeout: 200 }).catch(() => false)) return 'rewards';
    if (await cutscene.isVisible({ timeout: 200 }).catch(() => false)) return 'cutscene';
    if (await victoryOverlay.isVisible({ timeout: 200 }).catch(() => false)) return 'victory';
    if (await defeatOverlay.isVisible({ timeout: 200 }).catch(() => false)) return 'defeat';

    const label = (await executeButton.innerText().catch(() => '')).trim();
    if (label && !/Executing/i.test(label)) return 'planning';

    await demoDelay(page, 250);
  }

  throw new Error('Timed out waiting for battle state to advance.');
}

async function runBattle(page: Page, floorNum: number): Promise<{ result: 'victory' | 'defeat'; rounds: number }> {
  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView).toBeVisible({ timeout: 15_000 });

  const tutorialSkip = page.locator('[data-testid="battle-tutorial"] button').filter({ hasText: /^Skip$/i });
  if (await tutorialSkip.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await tutorialSkip.click();
    await demoDelay(page, 500);
  }

  const rewardsScreen = page.locator('.rewards-screen');
  const cutscene = page.locator('.post-battle-cutscene');
  const victoryOverlay = page.locator('.victory-overlay');
  const defeatOverlay = page.locator('.defeat-overlay');
  const executeButton = page.locator('[data-testid="battle-execute-round"]');
  const attackButton = page.locator('[data-testid="battle-quick-attack"]');
  const firstEnemy = page.locator('[data-testid^="battle-enemy-"]').first();

  await expect(attackButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(firstEnemy).toBeVisible({ timeout: DEFAULT_TIMEOUT });

  let roundCount = 0;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;
    if (await defeatOverlay.isVisible({ timeout: 300 }).catch(() => false)) {
      return { result: 'defeat', rounds: roundCount };
    }
    if (await cutscene.isVisible({ timeout: 300 }).catch(() => false)) {
      await advancePostBattleCutscene(page);
      continue;
    }
    if (await victoryOverlay.isVisible({ timeout: 300 }).catch(() => false)) {
      await advanceVictoryOverlay(page);
      continue;
    }

    if (!(await executeButton.isVisible({ timeout: 1000 }).catch(() => false))) {
      const step = await waitForBattleStep(page);
      if (step === 'cutscene') {
        await advancePostBattleCutscene(page);
      } else if (step === 'victory') {
        await advanceVictoryOverlay(page);
      } else if (step === 'defeat') {
        return { result: 'defeat', rounds: roundCount };
      } else if (step === 'rewards') {
        break;
      }
      continue;
    }

    // Queue actions
    for (let i = 0; i < 8; i++) {
      const label = (await executeButton.innerText().catch(() => '')).trim();
      if (/^Execute Round$/i.test(label)) break;
      if (/Executing/i.test(label)) {
        await demoDelay(page, 300);
        continue;
      }

      await attackButton.click({ force: true });
      await demoDelay(page, 100);
      await firstEnemy.click({ force: true });
      await demoDelay(page, 100);
    }

    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;

    if (/^Execute Round$/i.test((await executeButton.innerText().catch(() => '')).trim())) {
      await executeButton.click();
      roundCount++;
      logFloor(`  Floor ${floorNum} - Round ${roundCount} executed`);
      await demoDelay(page, 500);
    }

    const step = await waitForBattleStep(page);
    if (step === 'cutscene') {
      await advancePostBattleCutscene(page);
    } else if (step === 'victory') {
      await demoDelay(page, 1000);
    } else if (step === 'defeat') {
      return { result: 'defeat', rounds: roundCount };
    }
  }

  await expect(rewardsScreen).toBeVisible({ timeout: 30_000 });
  await demoDelay(page, 1000);

  return { result: 'victory', rounds: roundCount };
}

async function handleRestFloor(page: Page) {
  // Look for skip rest or continue button
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });
  const continueButton = page.locator('button').filter({ hasText: /continue/i });
  
  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await demoDelay(page, 500);
    return;
  }
  
  if (await continueButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await continueButton.click();
    await demoDelay(page, 500);
    return;
  }
  
  // Just press Enter if nothing else works
  await page.keyboard.press('Enter');
  await demoDelay(page, 500);
}

async function startNextFloor(page: Page) {
  const beginBattleButton = page.locator('button').filter({ hasText: /begin battle/i });
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });
  const continueButton = page.locator('button').filter({ hasText: /continue/i });

  if (await beginBattleButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await beginBattleButton.click();
    await demoDelay(page, 500);
    return 'battle';
  }

  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await demoDelay(page, 500);
    return 'rest';
  }

  if (await continueButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await continueButton.click();
    await demoDelay(page, 500);
    return 'continue';
  }

  const primaryAction = page.locator('button.primary').first();
  if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await primaryAction.click();
    await demoDelay(page, 500);
    return 'primary';
  }

  await page.keyboard.press('Enter');
  await demoDelay(page, 500);
  return 'enter';
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

  logFloor('🏰 Starting Full Tower Run...');
  if (DEMO_MODE) {
    logFloor('📺 DEMO MODE: Running at 3x slower speed for better viewing');
  }

  try {
    await page.goto('/');
    await expect(page.locator('.title-screen')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await demoDelay(page, 1000);

    await page.keyboard.press('Enter');
    await expect(page.locator('.main-menu')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await demoDelay(page, 500);

    const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: /battle tower/i });
    await expect(battleTowerOption).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await battleTowerOption.click();
    await demoDelay(page, 500);

    const towerHub = page.locator('.tower-hub');
    await expect(towerHub).toBeVisible({ timeout: 15_000 });
    await demoDelay(page, 1000);

    // Start tower run
    const startRunButton = page.locator('button').filter({ hasText: /start tower run/i });
    if (await startRunButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await startRunButton.click();
      await demoDelay(page, 500);
    }

    for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
      logFloor(`\n🏢 === FLOOR ${floor}/${TOTAL_FLOORS} ===`);
      
      const floorLog: FloorLog = {
        floor,
        type: 'battle',
        startTime: Date.now(),
      };

      // Start next floor
      const action = await startNextFloor(page);
      logFloor(`  Action taken: ${action}`);

      // Check if this is a rest floor
      const restIndicator = page.locator('text=/rest|heal|restore/i');
      if (await restIndicator.isVisible({ timeout: 1_000 }).catch(() => false)) {
        floorLog.type = 'rest';
        logFloor(`  🛏️ Rest floor - skipping`);
        await handleRestFloor(page);
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
      
      if (await teamSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
        logFloor(`  👥 Team select screen - confirming`);
        await page.keyboard.press('Enter');
        await demoDelay(page, 1000);
      }

      // Check if battle started
      if (await battleView.isVisible({ timeout: 5_000 }).catch(() => false)) {
        logFloor(`  ⚔️ Battle started`);
        
        // Determine if boss floor
        if (floor % 6 === 0 || floor === 30) {
          floorLog.type = 'boss';
          logFloor(`  👹 BOSS FLOOR!`);
        }
        
        const battleResult = await runBattle(page, floor);
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
        await demoDelay(page, 500);
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
      await dismissDialogueIfPresent(page);
      await demoDelay(page, 500);
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
