#!/usr/bin/env bash
# Deterministic BrainRouter smoke reproduction script.
# Captures mem-briefing, mem-semantic, and repo evidence into analysis/brainrouter/reproduction.log
set -u
OUT="$(pwd)/analysis/brainrouter/reproduction.log"
mkdir -p "$(dirname "$OUT")"
{
  echo "=== BrainRouter smoke reproduction run ==="
  date -u
  echo "--- mem-briefing ---"
  python3 /home/geni/swarm/memory/mem-briefing.py 2>&1 || echo "mem-briefing failed with $?"
  echo "--- mem-semantic (limit 10) ---"
  python3 /home/geni/swarm/memory/mem-semantic.py "BrainRouter smoke" --limit 10 2>&1 || echo "mem-semantic failed with $?"
  echo "--- ORCH_JOURNAL.md entries (case-insensitive) ---"
  grep -n -i "brain-router\|brainrouter\|BrainRouter" ORCH_JOURNAL.md || true
  echo "--- Repo-wide search for 'BrainRouter' ---"
  grep -R -n "BrainRouter" . || true
  echo "--- End of checks ---"
} 2>&1 | tee "$OUT"

# Determine exit code: 0 if evidence found in ORCH_JOURNAL.md, 2 otherwise
if grep -q -i "brain-router\|brainrouter\|BrainRouter" ORCH_JOURNAL.md; then
  echo "Smoke result: evidence found" | tee -a "$OUT"
  exit 0
else
  echo "Smoke result: no direct evidence found" | tee -a "$OUT"
  exit 2
fi
