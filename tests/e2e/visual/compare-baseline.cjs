#!/usr/bin/env node
// Compare latest screenshots against baseline using pixelmatch and pngjs
// Exits with code 0 when diffs are within threshold, 2 when any image exceeds threshold

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const CONFIG_PATH = path.resolve(__dirname, 'visual-regression-config.json');
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Config not found at', CONFIG_PATH);
  process.exit(2);
}

const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const BASELINE_DIR = path.resolve(__dirname, 'baseline');
const LATEST_DIR = path.resolve(__dirname, 'latest');
const DIFF_DIR = path.resolve(__dirname, 'diff');
const THRESHOLD = Number(cfg.threshold || 0.02); // fraction of pixels

function readPng(file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(new PNG())
      .on('parsed', function () { resolve(this); })
      .on('error', reject);
  });
}

(async () => {
  if (!fs.existsSync(LATEST_DIR)) {
    console.error('Latest screenshots not found at', LATEST_DIR);
    process.exit(2);
  }
  if (!fs.existsSync(BASELINE_DIR)) {
    console.error('Baseline screenshots not found at', BASELINE_DIR);
    process.exit(2);
  }
  fs.mkdirSync(DIFF_DIR, { recursive: true });

  const baselineFiles = fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
  if (baselineFiles.length === 0) {
    console.error('No baseline PNGs found in', BASELINE_DIR);
    process.exit(2);
  }

  let failed = false;
  for (const file of baselineFiles) {
    const basePath = path.join(BASELINE_DIR, file);
    const latestPath = path.join(LATEST_DIR, file);
    if (!fs.existsSync(latestPath)) {
      console.warn('Missing latest screenshot for', file);
      failed = true;
      continue;
    }

    const imgA = await readPng(basePath);
    const imgB = await readPng(latestPath);

    if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
      console.warn('Size mismatch for', file, imgA.width, imgA.height, 'vs', imgB.width, imgB.height);
      failed = true;
      continue;
    }

    const diff = new PNG({width: imgA.width, height: imgA.height});
    const diffPixels = pixelmatch(imgA.data, imgB.data, diff.data, imgA.width, imgA.height, {threshold: 0.1});
    const totalPixels = imgA.width * imgA.height;
    const frac = diffPixels / totalPixels;

    const outPath = path.join(DIFF_DIR, file);
    diff.pack().pipe(fs.createWriteStream(outPath));

    console.log(`${file}: ${diffPixels} pixels different (${(frac*100).toFixed(3)}%)`);

    if (frac > THRESHOLD) {
      console.error(`FAIL: ${file} exceeded threshold ${THRESHOLD} (found ${(frac).toFixed(4)})`);
      failed = true;
    }
  }

  if (failed) {
    console.error('Visual regression check failed. See diffs in', DIFF_DIR);
    process.exit(2);
  }

  console.log('All visual diffs within threshold.');
  process.exit(0);
})();
