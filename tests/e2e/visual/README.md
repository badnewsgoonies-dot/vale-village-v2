Visual regression helpers

This directory contains utilities for producing and validating visual baselines.

Files:
- generate-baseline.js — Playwright script that captures baseline screenshots of index.html into ./baseline/. It will NOT overwrite existing baseline images unless run with --force.

Usage:
- Ensure project dependencies (Playwright) are installed.
- Run:
  node tests/e2e/visual/generate-baseline.js
- To overwrite existing baseline images (careful):
  node tests/e2e/visual/generate-baseline.js --force

Notes:
- This script captures full-page screenshots of index.html via the file:// URL; for app states requiring a server, run the dev server and extend the script to point at http://localhost:PORT.
- The script intentionally avoids overwriting to respect existing baselines; CI can run with --force when intentionally regenerating baselines.
