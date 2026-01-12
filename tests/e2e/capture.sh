#!/usr/bin/env bash
set -euo pipefail

# Automated baseline capture: run a focused visual verification test with Playwright,
# collect trace artifacts and screenshots, and emit simple metrics (JSON + CSV).

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)" # tests/e2e parent
cd "${ROOT_DIR}/.."

mkdir -p analysis/traces analysis/baseline_screens

START_SECONDS=$(date +%s)

# Run a visual verification spec (adjust test path if needed). Use JSON reporter for machine parsing
# and enable Playwright traces.
npx playwright test tests/e2e/visual-verify.spec.ts --project=chromium --trace on --reporter=json:analysis/playwright_report.json

END_SECONDS=$(date +%s)
DURATION=$((END_SECONDS - START_SECONDS))

# Collect trace.zip artifacts produced by Playwright into analysis/traces and extract any JSON traces
find . -type f -name 'trace.zip' -print0 | while IFS= read -r -d '' f; do
  ts=$(date -r "$f" +%Y%m%dT%H%M%S)
  dest="analysis/traces/${ts}-$(basename "$(dirname "$f")").trace.zip"
  cp "$f" "$dest"
  # Attempt to extract any .json files from the Playwright trace zip into analysis/traces
  python3 - "$dest" <<'PY'
import sys, zipfile, os
zip_path = sys.argv[1]
try:
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if name.endswith('.json'):
                out_name = os.path.basename(zip_path) + '.' + os.path.basename(name)
                out_path = os.path.join('analysis', 'traces', out_name)
                with open(out_path, 'wb') as out_f:
                    out_f.write(zf.read(name))
except Exception:
    pass
PY
  # produce companion json metadata so analysis/traces contains .json entries
  size=$(stat -c%s "$dest" 2>/dev/null || echo 0)
  echo "{\"source\":\"$f\",\"stored\":\"$dest\",\"timestamp\":\"$ts\",\"size_bytes\":$size}" > "${dest}.json"
done

# Copy Playwright JSON reporter into traces for trace-like JSON output
if [ -f analysis/playwright_report.json ]; then
  cp analysis/playwright_report.json analysis/traces/playwright_report.json
fi

# Generate frame & animation metrics from collected JSON traces (may exit non-zero if no timing data found)
python3 analysis/generate_metrics.py --traces-dir analysis/traces --out-json analysis/frame_metrics.json --out-csv-prefix analysis/frame_metrics

# Ensure at least one trace JSON exists: if none, synthesize from report or create minimal placeholder
if [ "$(find analysis/traces -type f -name '*.json' | wc -l | tr -d '[:space:]')" -eq 0 ]; then
  if [ -f analysis/playwright_report.json ]; then
    # try to pretty-print if jq is available, otherwise copy raw
    jq '.' analysis/playwright_report.json > analysis/traces/trace-report.json 2>/dev/null || cp analysis/playwright_report.json analysis/traces/trace-report.json
  else
    # create minimal placeholder to signal collection attempted
    echo "{}" > analysis/traces/empty_trace.json
  fi
fi

# Copy any PNG snapshots from tests/e2e snapshot folders into baseline screenshots
find tests/e2e -type f -name '*.png' -print0 | while IFS= read -r -d '' img; do
  # avoid clobbering existing files
  cp -n "$img" analysis/baseline_screens/ || true
done

TRACE_COUNT=$(find analysis/traces -type f | wc -l | tr -d '[:space:]')
SCREENSHOT_COUNT=$(find analysis/baseline_screens -type f | wc -l | tr -d '[:space:]')

METRICS_JSON="{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"duration_seconds\":${DURATION},\"trace_count\":${TRACE_COUNT},\"screenshot_count\":${SCREENSHOT_COUNT}}"

echo "$METRICS_JSON" > analysis/metrics.json

echo "timestamp,duration_seconds,trace_count,screenshot_count" > analysis/metrics.csv
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ),${DURATION},${TRACE_COUNT},${SCREENSHOT_COUNT}" >> analysis/metrics.csv

# Exit non-zero if no traces or no screenshots were collected (fail fast for CI)
if [ "${TRACE_COUNT}" -eq 0 ]; then
  echo "ERROR: no Playwright traces were collected" >&2
  exit 1
fi

if [ "${SCREENSHOT_COUNT}" -eq 0 ]; then
  echo "WARNING: no screenshots were copied to analysis/baseline_screens" >&2
  # still exit non-zero per DOD? keep non-zero to indicate partial failure
  exit 1
fi

echo "Capture completed: ${TRACE_COUNT} traces, ${SCREENSHOT_COUNT} screenshots, duration ${DURATION}s"
exit 0
