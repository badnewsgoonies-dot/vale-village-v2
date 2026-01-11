#!/usr/bin/env sh
set -eu

OUT_DIR="$(dirname "$0")"
MARKER_FILE="$OUT_DIR/persist_marker.txt"
TOKEN="VV2-PERSISTENCE-TEST"
TIMESTAMP="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
printf '%s %s\n' "$TOKEN" "$TIMESTAMP" > "$MARKER_FILE"
printf 'WROTE %s\n' "$MARKER_FILE"
