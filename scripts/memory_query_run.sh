#!/usr/bin/env bash
set -euo pipefail

# Reproduce the memory briefing and recent-decision queries used by workers.
# Requires the swarm memory tools to be present under /home/geni/swarm/memory

echo "Running memory briefing and semantic queries..."
python3 /home/geni/swarm/memory/mem-briefing.py
python3 /home/geni/swarm/memory/mem-semantic.py "strategic-phase-1" --limit 10
/home/geni/swarm/memory/mem-db.sh query type=d recent=24h limit=15

echo "Done."
