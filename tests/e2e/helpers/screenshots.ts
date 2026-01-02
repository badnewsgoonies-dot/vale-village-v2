import type { Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function shot(page: Page, dirPath: string, filename: string) {
  await page.screenshot({
    path: path.join(dirPath, filename),
    fullPage: true,
  });
}
