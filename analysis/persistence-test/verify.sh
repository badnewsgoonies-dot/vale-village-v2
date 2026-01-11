#!/usr/bin/env sh
set -eu

MARKER="$(dirname "$0")/persist_marker.txt"
LOG="$(dirname "$0")/verification.log"
EXPECTED_TOKEN="VV2-PERSISTENCE-TEST"

status="ok"
details=""

if [ ! -f "$MARKER" ]; then
  status="fail"
  details="marker file missing: $MARKER"
  printf '%s %s %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "FAIL" "$details" > "$LOG"
  exit 2
fi

# Read first non-empty line
line=$(sed -n '/[^[:space:]]/p' "$MARKER" | sed -n '1p' || true)
if [ -z "$line" ]; then
  status="fail"
  details="marker file empty"
  printf '%s %s %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "FAIL" "$details" > "$LOG"
  exit 1
fi

# Split into token and timestamp
token=$(printf '%s' "$line" | awk '{print $1}')
ts=$(printf '%s' "$line" | awk '{print $2}')

if [ "$token" != "$EXPECTED_TOKEN" ]; then
  status="fail"
  details="token mismatch: got=$token expected=$EXPECTED_TOKEN"
fi

# Validate timestamp format YYYY-MM-DDThh:mm:ssZ
if echo "$ts" | grep -Eq '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$'; then
  # try parsing the timestamp (GNU date)
  if ! date -u -d "$ts" >/dev/null 2>&1; then
    status="fail"
    details="${details:+$details; }invalid timestamp parse: $ts"
  fi
else
  status="fail"
  details="${details:+$details; }timestamp format invalid: $ts"
fi

if [ "$status" = "ok" ]; then
  printf '%s %s token=%s timestamp=%s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "OK" "$token" "$ts" > "$LOG"
  exit 0
else
  printf '%s %s %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "FAIL" "$details" > "$LOG"
  exit 1
fi
