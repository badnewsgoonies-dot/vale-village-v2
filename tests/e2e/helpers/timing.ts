import type { Page } from '@playwright/test';

export type DelayFn = (page: Page, ms: number) => Promise<void>;

export const defaultDelay: DelayFn = async (page, ms) => {
  await page.waitForTimeout(ms);
};

export function createDelay(options: {
  demoMode: boolean;
  multiplier?: number;
  fastCapMs?: number;
}): DelayFn {
  const multiplier = options.multiplier ?? 3;
  const fastCapMs = options.fastCapMs ?? 100;

  return async (page, ms) => {
    if (options.demoMode) {
      await page.waitForTimeout(ms * multiplier);
      return;
    }

    await page.waitForTimeout(Math.min(ms, fastCapMs));
  };
}
