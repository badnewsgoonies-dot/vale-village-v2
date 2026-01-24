import type { Page } from '@playwright/test';

export type DelayFn = (page: Page, ms: number) => Promise<void>;

export const defaultDelay: DelayFn = async (page, ms) => {
  const selectors = ['canvas', '#app', '.game-root', '[data-testid="game-root"]'];
  try {
    // Wait for a visible root element for up to the requested ms, otherwise fall back to timeout
    await page.waitForSelector(selectors.join(','), { timeout: ms });
  } catch {
    await page.waitForTimeout(ms);
  }
};

export function createDelay(options: {
  demoMode: boolean;
  multiplier?: number;
  fastCapMs?: number;
}): DelayFn {
  const multiplier = options.multiplier ?? 3;
  const fastCapMs = options.fastCapMs ?? 100;
  const selectors = ['canvas', '#app', '.game-root', '[data-testid="game-root"]'];

  return async (page, ms) => {
    const timeoutMs = options.demoMode ? ms * multiplier : Math.min(ms, fastCapMs);
    try {
      // Prefer waiting for a visible root element; fall back to a timeout if it doesn't appear
      await page.waitForSelector(selectors.join(','), { timeout: timeoutMs });
    } catch {
      await page.waitForTimeout(timeoutMs);
    }
  };
}
