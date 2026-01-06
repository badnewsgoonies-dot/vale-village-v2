const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);
const heavySignals = ["screenshot", "toHaveScreenshot", "toMatchSnapshot", "haveScreenshot", "maxDiffPixels"]; 

const heavy = [];
const stable = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && (e.name.endsWith('.spec.ts') || e.name.endsWith('.spec.js'))) {
      const txt = fs.readFileSync(full, 'utf8');
      const lowered = txt.toLowerCase();
      const isHeavy = heavySignals.some(s => lowered.includes(s.toLowerCase()));
      const rel = path.relative(root, full);
      if (isHeavy) heavy.push(rel);
      else stable.push(rel);
    }
  }
}

walk(root);

const out = { stable, heavy, generatedAt: new Date().toISOString() };
const outPath = path.join(root, 'test-classification.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote classification to', outPath);
console.log('Stable tests:', stable.length, 'Heavy tests:', heavy.length);