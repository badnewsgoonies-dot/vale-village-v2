import type { Page } from '@playwright/test';
import { defaultDelay, type DelayFn } from './timing';

export async function holdKey(page: Page, key: string, ms: number, delay: DelayFn = defaultDelay) {
  await page.keyboard.down(key);
  await delay(page, ms);
  await page.keyboard.up(key);
}

export async function tapSpace(page: Page, delay: DelayFn = defaultDelay, pressMs = 120) {
  await page.keyboard.down('Space');
  await delay(page, pressMs);
  await page.keyboard.up('Space');
}
