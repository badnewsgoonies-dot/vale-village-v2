#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MR="$ROOT/docs/market_research.md"
VI="$ROOT/docs/video_inspiration.md"
MG="$ROOT/docs/mechanic_gap_analysis.md"

python3 - "$MR" "$VI" "$MG" <<'PY'
import sys, re
mr_path, vi_path, mg_path = sys.argv[1:4]

def read_file(p):
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()

mr = read_file(mr_path).splitlines()
vi = read_file(vi_path).splitlines()
mg = read_file(mg_path).splitlines()

# Extract games from market_research.md
games = []
for line in mr:
    m = re.match(r'^\s*\d+\)\s*(.*)', line)
    if m:
        name = m.group(1).strip()
        name = re.sub(r'\s*\(.*$', '', name)
        name = re.sub(r'\s*—.*$', '', name)
        games.append(name)

print(f"Found {len(games)} games in market_research.md")

# Parse video_inspiration into sections by '## ' headings
sections = {}
current = None
for ln in vi:
    m = re.match(r'^##\s*(.*)', ln)
    if m:
        current = m.group(1).strip()
        sections[current] = []
        continue
    if current is not None:
        sections[current].append(ln)

failures = []
for g in games:
    sect = sections.get(g, [])
    # Count only Early/Mid/Boss clip lines
    clips = [l for l in sect if re.match(r'^\s*-\s*(Early|Mid|Boss)\s*:', l)]
    if len(clips) != 3:
        failures.append(f"{g}: has {len(clips)} clips (expected 3)")
    else:
        print(f"OK: '{g}' has 3 clips")

# Extract critical gaps section
mg_text = '\n'.join(mg)
m_start = re.search(r'^(Summary of critical gaps|Critical Gaps)', mg_text, flags=re.I|re.M)
m_end = re.search(r'^Additional recommended engineering changes', mg_text, flags=re.M)
if not m_start:
    failures.append('mechanic_gap_analysis.md: missing Summary of critical gaps marker')
else:
    start = m_start.end()
    end = m_end.start() if m_end else len(mg_text)
    section = mg_text[start:end]
    # Count top-level numbered items
    nums = re.findall(r'^\s*(\d+)\)', section, flags=re.M)
    if len(nums) != 5:
        failures.append(f"mechanic_gap_analysis.md: has {len(nums)} critical gaps (expected 5)")
    else:
        print("OK: mechanic_gap_analysis.md has 5 critical gaps")
    # For each gap, ensure 'Fixes' appears in its block
    # Split blocks by numbered headers
    blocks = re.split(r'(?m)^\s*\d+\)', section)
    # first split part before first number may be empty; blocks[i] corresponds to gap i
    for i in range(1, min(6, len(blocks))):
        block = blocks[i]
        if not re.search(r'[Ff]ixes', block):
            failures.append(f"Gap {i} missing Fixes section")
        else:
            print(f"OK: Gap {i} has Fixes")

if failures:
    print('verify_research: FAILED')
    for f in failures:
        print('ERROR:', f)
    sys.exit(1)

print('verify_research: SUCCESS — all checks passed')
sys.exit(0)
PY

# Run python check
bash -c "python3 - \"$MR\" \"$VI\" \"$MG\"" <<'PY'
# placeholder to satisfy heredoc wrapper
PY
