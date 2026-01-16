#!/usr/bin/env node
// CommonJS variant: Compare baseline PNG files with their -chromium-linux variants by byte equality and SHA256.
// Produces tests/e2e/visual/diff-report.json summarizing matches.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname);
const BASELINE_DIR = path.join(ROOT, 'baseline');
const OUT_FILE = path.join(ROOT, 'diff-report.json');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

if (!fs.existsSync(BASELINE_DIR)) {
  console.error('Baseline directory not found:', BASELINE_DIR);
  process.exit(2);
}

const files = fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
const pairs = {};

for (const f of files) {
  if (f.endsWith('-chromium-linux.png')) {
    const base = f.replace('-chromium-linux.png', '.png');
    pairs[base] = pairs[base] || {};
    pairs[base].other = f;
  } else {
    pairs[f] = pairs[f] || {};
    pairs[f].base = f;
  }
}

const results = [];
let overallPass = true;

for (const [name, p] of Object.entries(pairs)) {
  if (!p.base) continue; // skip incomplete
  const basePath = path.join(BASELINE_DIR, p.base);
  const otherPath = p.other ? path.join(BASELINE_DIR, p.other) : null;

  const baseBuf = fs.readFileSync(basePath);
  const baseHash = sha256(baseBuf);
  const baseSize = baseBuf.length;

  if (!otherPath || !fs.existsSync(otherPath)) {
    results.push({ name: p.base, status: 'only-baseline', baseHash, baseSize });
    overallPass = false;
    continue;
  }

  const otherBuf = fs.readFileSync(otherPath);
  const otherHash = sha256(otherBuf);
  const otherSize = otherBuf.length;

  const equal = baseBuf.equals(otherBuf);
  if (!equal) overallPass = false;

  results.push({
    name: p.base,
    baseline: { file: p.base, size: baseSize, sha256: baseHash },
    other: { file: p.other, size: otherSize, sha256: otherHash },
    equal
  });
}

const report = { timestamp: new Date().toISOString(), overallPass, results };
fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
console.log('Wrote diff report to', OUT_FILE);
console.log('Overall pass:', overallPass ? 'YES' : 'NO');
process.exit(overallPass ? 0 : 3);
