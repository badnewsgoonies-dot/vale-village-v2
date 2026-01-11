#!/usr/bin/env node
/*
 * Simple helper to extract boot-time diagnostics from local dev logs.
 * Looks for lines prefixed with "VV2_BOOT_LOG:" and prints them.
 */
import * as fs from 'fs';
import * as path from 'path';

const candidates = ['dev_server.log', 'dev.log', 'dev-server.log', 'dev.log', 'dev.log'];

function findLogs() {
  for (const name of candidates) {
    const p = path.resolve(process.cwd(), name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const logPath = findLogs();
if (!logPath) {
  console.error('No dev log found. Checked:', candidates.join(', '));
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf-8');
const lines = content.split(/\r?\n/);
for (const line of lines) {
  if (line.includes('VV2_BOOT_LOG:')) {
    const idx = line.indexOf('VV2_BOOT_LOG:');
    const rest = line.slice(idx + 'VV2_BOOT_LOG:'.length).trim();
    try {
      const obj = JSON.parse(rest);
      console.log(JSON.stringify(obj, null, 2));
    } catch (e) {
      console.log(rest);
    }
  }
}
