import { expect, type Page } from '@playwright/test';
import { defaultDelay, type DelayFn } from './timing';

export type BattleStep = 'rewards' | 'cutscene' | 'victory' | 'defeat' | 'planning';

export type RunBattleOptions = {
  delay?: DelayFn;
  maxRounds?: number;
  battleViewTimeoutMs?: number;
  actionTimeoutMs?: number;
  queueDelayMs?: number;
  targetDelayMs?: number;
  executingDelayMs?: number;
  executeDelayMs?: number;
  victoryDelayMs?: number;
  rewardsDelayMs?: number;
  tutorialSkipDelayMs?: number;
  pollDelayMs?: number;
  waitTimeoutMs?: number;
  forceClicks?: boolean;
  onRoundExecuted?: (round: number) => void;
};

export async function advancePostBattleCutscene(
  page: Page,
  options: { delay?: DelayFn; stepDelayMs?: number; timeoutMs?: number } = {},
): Promise<boolean> {
  const delay = options.delay ?? defaultDelay;
  const stepDelayMs = options.stepDelayMs ?? 300;
  const timeoutMs = options.timeoutMs ?? 500;

  const cutscene = page.locator('.post-battle-cutscene');
  if (!(await cutscene.isVisible({ timeout: timeoutMs }).catch(() => false))) return false;

  const advanceButton = cutscene.locator('.cutscene-button');
  for (let i = 0; i < 8; i++) {
    if (!(await cutscene.isVisible({ timeout: 300 }).catch(() => false))) return true;
    if (await advanceButton.isVisible({ timeout: 300 }).catch(() => false)) {
      await advanceButton.click();
    } else {
      await page.keyboard.press('Enter');
    }
    await delay(page, stepDelayMs);
  }

  return true;
}

export async function advanceVictoryOverlay(
  page: Page,
  options: { delay?: DelayFn; stepDelayMs?: number; timeoutMs?: number } = {},
): Promise<boolean> {
  const delay = options.delay ?? defaultDelay;
  const stepDelayMs = options.stepDelayMs ?? 500;
  const timeoutMs = options.timeoutMs ?? 500;

  const victoryOverlay = page.locator('.victory-overlay');
  if (!(await victoryOverlay.isVisible({ timeout: timeoutMs }).catch(() => false))) return false;

  const continueButton = victoryOverlay.locator('.victory-continue-btn');
  if (await continueButton.isVisible({ timeout: timeoutMs }).catch(() => false)) {
    await continueButton.click();
    await delay(page, stepDelayMs);
    return true;
  }

  const genericContinue = victoryOverlay.locator('button').filter({ hasText: /continue/i }).first();
  if (await genericContinue.isVisible({ timeout: timeoutMs }).catch(() => false)) {
    await genericContinue.click();
    await delay(page, stepDelayMs);
    return true;
  }

  await page.keyboard.press('Enter');
  await delay(page, stepDelayMs);
  return true;
}

export async function waitForBattleStep(
  page: Page,
  options: { delay?: DelayFn; timeoutMs?: number; pollDelayMs?: number } = {},
): Promise<BattleStep> {
  const delay = options.delay ?? defaultDelay;
  const timeoutMs = options.timeoutMs ?? 25_000;
  const pollDelayMs = options.pollDelayMs ?? 250;

  const rewardsScreen = page.locator('.rewards-screen');
  const cutscene = page.locator('.post-battle-cutscene');
  const victoryOverlay = page.locator('.victory-overlay');
  const defeatOverlay = page.locator('.defeat-overlay');
  const executeButton = page.locator('[data-testid="battle-execute-round"]');

  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await rewardsScreen.isVisible({ timeout: 200 }).catch(() => false)) return 'rewards';
    if (await cutscene.isVisible({ timeout: 200 }).catch(() => false)) return 'cutscene';
    if (await victoryOverlay.isVisible({ timeout: 200 }).catch(() => false)) return 'victory';
    if (await defeatOverlay.isVisible({ timeout: 200 }).catch(() => false)) return 'defeat';

    const label = (await executeButton.innerText().catch(() => '')).trim();
    if (label && !/Executing/i.test(label)) return 'planning';

    await delay(page, pollDelayMs);
  }

  throw new Error('Timed out waiting for battle state to advance.');
}

export async function runBattle(
  page: Page,
  options: RunBattleOptions = {},
): Promise<{ result: 'victory' | 'defeat'; rounds: number }> {
  const delay = options.delay ?? defaultDelay;
  const maxRounds = options.maxRounds ?? 50;
  const battleViewTimeoutMs = options.battleViewTimeoutMs ?? 15_000;
  const actionTimeoutMs = options.actionTimeoutMs ?? 10_000;
  const queueDelayMs = options.queueDelayMs ?? 100;
  const targetDelayMs = options.targetDelayMs ?? 100;
  const executingDelayMs = options.executingDelayMs ?? 300;
  const executeDelayMs = options.executeDelayMs ?? 500;
  const victoryDelayMs = options.victoryDelayMs ?? 1000;
  const rewardsDelayMs = options.rewardsDelayMs ?? 1000;
  const tutorialSkipDelayMs = options.tutorialSkipDelayMs ?? 500;
  const pollDelayMs = options.pollDelayMs ?? 250;
  const waitTimeoutMs = options.waitTimeoutMs ?? 25_000;
  const forceClicks = options.forceClicks ?? false;

  const battleView = page.locator('[data-testid="battle-view"]');
  await expect(battleView).toBeVisible({ timeout: battleViewTimeoutMs });

  const tutorialSkip = page.locator('[data-testid="battle-tutorial"] button').filter({ hasText: /^Skip$/i });
  if (await tutorialSkip.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await tutorialSkip.click();
    await delay(page, tutorialSkipDelayMs);
  }

  const rewardsScreen = page.locator('.rewards-screen');
  const cutscene = page.locator('.post-battle-cutscene');
  const victoryOverlay = page.locator('.victory-overlay');
  const defeatOverlay = page.locator('.defeat-overlay');
  const executeButton = page.locator('[data-testid="battle-execute-round"]');
  const attackButton = page.locator('[data-testid="battle-quick-attack"]');
  const firstEnemy = page.locator('[data-testid^="battle-enemy-"]').first();

  await expect(attackButton).toBeVisible({ timeout: actionTimeoutMs });
  await expect(firstEnemy).toBeVisible({ timeout: actionTimeoutMs });

  let roundCount = 0;

  for (let round = 0; round < maxRounds; round++) {
    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;
    if (await defeatOverlay.isVisible({ timeout: 300 }).catch(() => false)) {
      return { result: 'defeat', rounds: roundCount };
    }
    if (await cutscene.isVisible({ timeout: 300 }).catch(() => false)) {
      await advancePostBattleCutscene(page, { delay });
      continue;
    }
    if (await victoryOverlay.isVisible({ timeout: 300 }).catch(() => false)) {
      await advanceVictoryOverlay(page, { delay });
      continue;
    }

    if (!(await executeButton.isVisible({ timeout: 1000 }).catch(() => false))) {
      const step = await waitForBattleStep(page, { delay, timeoutMs: waitTimeoutMs, pollDelayMs });
      if (step === 'cutscene') {
        await advancePostBattleCutscene(page, { delay });
      } else if (step === 'victory') {
        await advanceVictoryOverlay(page, { delay });
      } else if (step === 'defeat') {
        return { result: 'defeat', rounds: roundCount };
      } else if (step === 'rewards') {
        break;
      }
      continue;
    }

    for (let i = 0; i < 8; i++) {
      const label = (await executeButton.innerText().catch(() => '')).trim();
      if (/^Execute Round$/i.test(label)) break;
      if (/Executing/i.test(label)) {
        await delay(page, executingDelayMs);
        continue;
      }

      if (forceClicks) {
        await attackButton.click({ force: true });
      } else {
        await attackButton.click();
      }
      await delay(page, queueDelayMs);

      if (forceClicks) {
        await firstEnemy.click({ force: true });
      } else {
        await firstEnemy.click();
      }
      await delay(page, targetDelayMs);
    }

    if (await rewardsScreen.isVisible({ timeout: 300 }).catch(() => false)) break;

    if (/^Execute Round$/i.test((await executeButton.innerText().catch(() => '')).trim())) {
      await executeButton.click();
      roundCount++;
      options.onRoundExecuted?.(roundCount);
      await delay(page, executeDelayMs);
    }

    const step = await waitForBattleStep(page, { delay, timeoutMs: waitTimeoutMs, pollDelayMs });
    if (step === 'cutscene') {
      await advancePostBattleCutscene(page, { delay });
    } else if (step === 'victory') {
      await delay(page, victoryDelayMs);
    } else if (step === 'defeat') {
      return { result: 'defeat', rounds: roundCount };
    }
  }

  await expect(rewardsScreen).toBeVisible({ timeout: 30_000 });
  await delay(page, rewardsDelayMs);

  return { result: 'victory', rounds: roundCount };
}
