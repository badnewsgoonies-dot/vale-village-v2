import type { Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function shot(page: Page, dirPath: string, filename: string) {
  // Only write screenshots when running heavy visual tests.
  // Set RUN_HEAVY=1 to enable (CI can opt-in).
  const ENABLE_HEAVY = !!process.env.RUN_HEAVY;
  if (!ENABLE_HEAVY) return;

  ensureDir(dirPath);
  await page.screenshot({
    path: path.join(dirPath, filename),
    fullPage: true,
  });
}
