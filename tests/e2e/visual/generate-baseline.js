#!/usr/bin/env node
// Small, non-destructive baseline generator using Playwright.
// - Places baseline screenshots in tests/e2e/visual/baseline/
// - Will NOT overwrite existing files unless --force is passed

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BASELINE_DIR = path.resolve(__dirname, 'baseline');
const INDEX_FILE = path.resolve(ROOT, 'index.html');

const SPEC_SCREENS = [
  { name: 'title-screen.png', desc: 'Title screen (full page)' },
  { name: 'main-menu.png', desc: 'Main menu (full page)' },
];

const FORCE = process.argv.includes('--force');

async function ensureBaselineDir() {
  if (!fs.existsSync(BASELINE_DIR)) fs.mkdirSync(BASELINE_DIR, { recursive: true });
}

async function takeScreenshots() {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error('ERROR: index.html not found at', INDEX_FILE);
    process.exit(2);
  }

  await ensureBaselineDir();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const url = 'file://' + INDEX_FILE;
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  for (const spec of SPEC_SCREENS) {
    const dest = path.join(BASELINE_DIR, spec.name);
    if (fs.existsSync(dest) && !FORCE) {
      console.log(`Skipping existing baseline: ${spec.name}`);
      continue;
    }

    // Allow the page some time to settle visuals
    await page.waitForTimeout(800);

    console.log(`Capturing: ${spec.desc} -> ${dest}`);
    await page.screenshot({ path: dest, fullPage: true });
  }

  await browser.close();
}

(async () => {
  try {
    await takeScreenshots();
    console.log('Baseline generation complete.');
  } catch (err) {
    console.error('Baseline generation failed:', err);
    process.exit(1);
  }
})();
