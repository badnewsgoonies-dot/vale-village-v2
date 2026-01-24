#!/usr/bin/env bash
set -euo pipefail

# Automated baseline capture and population script
# - Runs the repository's visual capture pipeline
# - Copies any newly-produced screenshots into the project's visual baseline folder
# Constants (avoid magic numbers)
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CAPTURE_SCRIPT="$ROOT_DIR/tests/e2e/capture.sh"
ANALYSIS_BASELINE_DIR="$ROOT_DIR/analysis/baseline_screens"
TARGET_BASELINE_DIR="$ROOT_DIR/tests/e2e/visual/baseline"

if [ ! -f "$CAPTURE_SCRIPT" ]; then
  echo "Capture script not found at $CAPTURE_SCRIPT" >&2
  exit 2
fi

if [ ! -x "$CAPTURE_SCRIPT" ]; then
  echo "Making capture script executable: $CAPTURE_SCRIPT"
  chmod +x "$CAPTURE_SCRIPT" || true
fi

echo "Running visual capture via: $CAPTURE_SCRIPT"
# Run capture (this will run Playwright tests and populate analysis/baseline_screens)
"$CAPTURE_SCRIPT"

# Ensure target baseline directory exists
mkdir -p "$TARGET_BASELINE_DIR"

# Copy produced baseline images into visual baseline folder without overwriting existing files
COPIED_COUNT=0
if [ -d "$ANALYSIS_BASELINE_DIR" ]; then
  for img in "$ANALYSIS_BASELINE_DIR"/*.png; do
    [ -e "$img" ] || continue
    dest="$TARGET_BASELINE_DIR/$(basename "$img")"
    if [ ! -e "$dest" ]; then
      cp "$img" "$dest"
      COPIED_COUNT=$((COPIED_COUNT + 1))
    fi
  done
else
  echo "No analysis baseline directory found at $ANALYSIS_BASELINE_DIR" >&2
fi

echo "Baseline update complete. Copied $COPIED_COUNT new images into $TARGET_BASELINE_DIR"
TOTAL=$(find "$TARGET_BASELINE_DIR" -type f -name '*.png' | wc -l | tr -d '[:space:]' || echo 0)
echo "Total baseline images now: $TOTAL"

exit 0
