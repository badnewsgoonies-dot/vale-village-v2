import { expect, type Page } from '@playwright/test';
import { defaultDelay, type DelayFn } from './timing';

export type StartTowerRunOptions = {
  delay?: DelayFn;
  delayMs?: number;
  timeoutMs?: number;
  requireVisible?: boolean;
  allowPrimaryFallback?: boolean;
};

export async function startTowerRun(
  page: Page,
  options: StartTowerRunOptions = {},
): Promise<void> {
  const delay = options.delay ?? defaultDelay;
  const delayMs = options.delayMs ?? 500;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const requireVisible = options.requireVisible ?? false;
  const allowPrimaryFallback = options.allowPrimaryFallback ?? false;

  const startRunButton = page.locator('button').filter({ hasText: /start tower run/i });
  if (await startRunButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await startRunButton.click();
    await delay(page, delayMs);
    return;
  }

  if (allowPrimaryFallback) {
    const primaryAction = page.locator('button.primary').first();
    if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await primaryAction.click();
      await delay(page, delayMs);
      return;
    }
  }

  if (requireVisible) {
    await expect(startRunButton).toBeVisible({ timeout: timeoutMs });
  }
}

export type BeginBattleOptions = {
  delay?: DelayFn;
  delayMs?: number;
  timeoutMs?: number;
  requireVisible?: boolean;
  allowPrimaryFallback?: boolean;
};

export async function beginBattleFromTower(
  page: Page,
  options: BeginBattleOptions = {},
): Promise<void> {
  const delay = options.delay ?? defaultDelay;
  const delayMs = options.delayMs ?? 500;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const requireVisible = options.requireVisible ?? false;
  const allowPrimaryFallback = options.allowPrimaryFallback ?? false;

  const beginBattleButton = page.locator('button').filter({ hasText: /begin battle/i });
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });

  if (await beginBattleButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await beginBattleButton.click();
    await delay(page, delayMs);
    return;
  }

  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await delay(page, delayMs);
    return;
  }

  if (allowPrimaryFallback) {
    const primaryAction = page.locator('button.primary').first();
    if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await primaryAction.click();
      await delay(page, delayMs);
      return;
    }
  }

  if (requireVisible) {
    await expect(beginBattleButton).toBeVisible({ timeout: timeoutMs });
  }
}

export async function handleRestFloor(
  page: Page,
  options: { delay?: DelayFn; delayMs?: number } = {},
): Promise<void> {
  const delay = options.delay ?? defaultDelay;
  const delayMs = options.delayMs ?? 500;

  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });
  const continueButton = page.locator('button').filter({ hasText: /continue/i });

  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await delay(page, delayMs);
    return;
  }

  if (await continueButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await continueButton.click();
    await delay(page, delayMs);
    return;
  }

  await page.keyboard.press('Enter');
  await delay(page, delayMs);
}

export async function startNextFloor(
  page: Page,
  options: { delay?: DelayFn; delayMs?: number } = {},
): Promise<'battle' | 'rest' | 'continue' | 'primary' | 'enter'> {
  const delay = options.delay ?? defaultDelay;
  const delayMs = options.delayMs ?? 500;

  const beginBattleButton = page.locator('button').filter({ hasText: /begin battle/i });
  const skipRestButton = page.locator('button').filter({ hasText: /skip rest/i });
  const continueButton = page.locator('button').filter({ hasText: /continue/i });

  if (await beginBattleButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await beginBattleButton.click();
    await delay(page, delayMs);
    return 'battle';
  }

  if (await skipRestButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await skipRestButton.click();
    await delay(page, delayMs);
    return 'rest';
  }

  if (await continueButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await continueButton.click();
    await delay(page, delayMs);
    return 'continue';
  }

  const primaryAction = page.locator('button.primary').first();
  if (await primaryAction.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await primaryAction.click();
    await delay(page, delayMs);
    return 'primary';
  }

  await page.keyboard.press('Enter');
  await delay(page, delayMs);
  return 'enter';
}
