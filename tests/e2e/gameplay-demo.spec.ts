import { test, expect, type Page } from '@playwright/test';
test.skip(!process.env.RUN_HEAVY, 'Skipping heavy e2e tests by default');

// DEMO MODE: Slower, more visual-friendly timings for watching the game play
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const DEMO_DELAY_MULTIPLIER = DEMO_MODE ? 3 : 1; // 3x slower in demo mode
const DEFAULT_TIMEOUT = 10_000;
const MAX_ROUNDS = 20;

// Helper to add demo-friendly delays
async function demoDelay(page: Page, ms: number) {
  await page.waitForTimeout(ms * DEMO_DELAY_MULTIPLIER);
}

async function hold(page: Page, key: string, ms: number) {
  await page.keyboard.down(key);
  await demoDelay(page, ms);
  await page.keyboard.up(key);
}

async function tapSpace(page: Page) {
  await page.keyboard.down('Space');
  await demoDelay(page, 120);
  await page.keyboard.up('Space');
}

async function dismissDialogueIfPresent(page: Page) {
  const chatOverlay = page.locator('.dialogue-chat-overlay');
  if (!(await chatOverlay.isVisible({ timeout: 1200 }).catch(() => false))) return;

  const closeButton = page.locator('.dialogue-chat-close');
  if (await closeButton.isVisible({ timeout: 800 }).catch(() => false)) {
    await closeButton.click();
    await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
    return;
  }

  for (let i = 0; i < 40; i++) {
    if (!(await chatOverlay.isVisible({ timeout: 200 }).catch(() => false))) return;

    const choice = page.locator('.dialogue-chat-choice').first();
    if (await choice.isVisible({ timeout: 200 }).catch(() => false)) {
      await choice.click();
      await demoDelay(page, 300); // Longer delay in demo mode to read dialogue
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

  await expect(chatOverlay).not.toBeVisible({ timeout: 10_000 });
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
    await demoDelay(page, 500); // Longer delay to see cutscene
  }

  await expect(cutscene).not.toBeVisible({ timeout: 10_000 });
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

async function startTowerRun(page: Page) {
  const startRunButton = page.locator('button').filter({ hasText: /start tower run/i });
  if (await startRunButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await startRunButton.click();
    await demoDelay(page, 1000);
    return;
  }

  const primaryAction = page.locator('button.primary').first();
  if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await primaryAction.click();
    await demoDelay(page, 1000);
    return;
  }

  await expect(startRunButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
}

async function beginBattleFromTower(page: Page) {
  const beginBattleButton = page.locator('button').filter({ hasText: /begin battle/i });
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });

  if (await beginBattleButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await beginBattleButton.click();
    await demoDelay(page, 1000);
    return;
  }

  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await demoDelay(page, 1000);
    return;
  }

  const primaryAction = page.locator('button.primary').first();
  if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await primaryAction.click();
    await demoDelay(page, 1000);
    return;
  }

  await expect(beginBattleButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
}

async function runBasicBattle(page: Page) {
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
  const executeButton = page.locator('[data-testid="battle-execute-round"]');
  const attackButton = page.locator('[data-testid="battle-quick-attack"]');
  const firstEnemy = page.locator('[data-testid^="battle-enemy-"]').first();

  await expect(attackButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(firstEnemy).toBeVisible({ timeout: DEFAULT_TIMEOUT });

  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;
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
        throw new Error('Battle ended in defeat.');
      } else if (step === 'rewards') {
        break;
      }
      continue;
    }

    // Queue actions - slower in demo mode to see each action
    for (let i = 0; i < 8; i++) {
      const label = (await executeButton.innerText().catch(() => '')).trim();
      if (/^Execute Round$/i.test(label)) break;
      if (/Executing/i.test(label)) {
        await demoDelay(page, 500); // Longer delay during execution
        continue;
      }

      await attackButton.click();
      await demoDelay(page, 200); // Pause to see action selection
      await firstEnemy.click();
      await demoDelay(page, 300); // Pause to see target selection
    }

    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;

    if (/^Execute Round$/i.test((await executeButton.innerText().catch(() => '')).trim())) {
      await executeButton.click();
      await demoDelay(page, 1000); // Pause before execution
    }

    const step = await waitForBattleStep(page);
    if (step === 'cutscene') {
      await advancePostBattleCutscene(page);
    } else if (step === 'victory') {
      await demoDelay(page, 3000); // Longer pause to see victory
    } else if (step === 'defeat') {
      throw new Error('Battle ended in defeat.');
    }
  }

  await expect(rewardsScreen).toBeVisible({ timeout: 30_000 });
  await demoDelay(page, 2000); // Pause to see rewards
}

test('Gameplay demo - watch the game play through automatically', async ({ page }) => {
  test.setTimeout(300_000); // 5 minutes for demo mode

  console.log('🎮 Starting gameplay demo...');
  if (DEMO_MODE) {
    console.log('📺 DEMO MODE: Running at 3x slower speed for better viewing');
  }

  await page.goto('/');
  await expect(page.locator('.title-screen')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await demoDelay(page, 2000); // Pause on title screen

  await page.keyboard.press('Enter');
  await expect(page.locator('.main-menu')).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await demoDelay(page, 1500); // Pause to see menu

  const battleTowerOption = page.locator('.main-menu-option').filter({ hasText: /battle tower/i });
  await expect(battleTowerOption).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await battleTowerOption.click();
  await demoDelay(page, 1000);

  const towerHub = page.locator('.tower-hub');
  await expect(towerHub).toBeVisible({ timeout: 15_000 });
  await demoDelay(page, 2000); // Pause to see tower hub

  await startTowerRun(page);
  await beginBattleFromTower(page);

  const teamSelect = page.locator('.prebattle-v2-overlay');
  const fallbackNoBattle = page.getByText('No battle pending');
  await expect(teamSelect.or(fallbackNoBattle)).toBeVisible({ timeout: 10_000 });
  await demoDelay(page, 2000); // Pause to see team select

  if (await fallbackNoBattle.isVisible({ timeout: 500 }).catch(() => false)) {
    throw new Error('Battle did not start: prebattle overlay missing and "No battle pending" shown.');
  }

  await page.keyboard.press('Enter');
  await demoDelay(page, 2000);

  console.log('⚔️ Starting battle...');
  await runBasicBattle(page);
  console.log('✅ Battle complete!');

  await page.keyboard.press('Enter');
  await expect(towerHub).toBeVisible({ timeout: 20_000 });
  await demoDelay(page, 2000);

  await dismissDialogueIfPresent(page);
  console.log('🎉 Demo complete!');
});
