const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = path.resolve(__dirname);
const patterns = ['**/*.spec.ts', '**/*.spec.js'];
const heavySignals = ["screenshot", "toHaveScreenshot", "toMatchSnapshot", "haveScreenshot", "maxDiffPixels"]; 

const heavy = [];
const stable = [];

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: root, absolute: true });
  files.forEach(f => {
    const txt = fs.readFileSync(f, 'utf8');
    const lowered = txt.toLowerCase();
    const isHeavy = heavySignals.some(s => lowered.includes(s.toLowerCase()));
    const rel = path.relative(root, f);
    if (isHeavy) heavy.push(rel);
    else stable.push(rel);
  });
});

const out = { stable, heavy, generatedAt: new Date().toISOString() };
const outPath = path.join(root, 'test-classification.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote classification to', outPath);
console.log('Stable tests:', stable.length, 'Heavy tests:', heavy.length);