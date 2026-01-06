#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"
node tests/e2e/classify-tests.cjs

if [ -z "${RUN_HEAVY_E2E-}" ]; then
  echo "RUN_HEAVY_E2E not set: running STABLE tests only (fast green path)"
  FILES=$(node -e "const j=require('./tests/e2e/test-classification.json'); console.log(j.stable.map(f=>'tests/e2e/'+f).join(' '))")
else
  echo "RUN_HEAVY_E2E set: running STABLE+HEAVY tests"
  FILES=$(node -e "const j=require('./tests/e2e/test-classification.json'); console.log(j.stable.concat(j.heavy).map(f=>'tests/e2e/'+f).join(' '))")
fi

if [ -z "$FILES" ]; then
  echo "No test files found to run" >&2
  exit 0
fi

# Use npx to run Playwright test runner with selected files
echo "Running Playwright on: $FILES"
npx playwright test $FILES
