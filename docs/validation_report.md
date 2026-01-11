# Validation Report - Automated Checks

Run date: 2026-01-11T18:20:24Z

Summary
-------
This report contains deterministic grep/jq-based checks that validate the round brief criteria against the current docs.

Automated checks (commands and observed outputs)
-----------------------------------------------
- Count games (lines starting with '## '):
  - command: grep -nE '^##+' docs/video_inspiration.md | wc -l
  - output: 6
- Per-game clip presence (Early/Mid/Boss) - targeted greps:
  - Early clips: grep -c -E '^\s*[-*]\s*Early:' docs/video_inspiration.md  -> 6
  - Mid clips:   grep -c -E '^\s*[-*]\s*Mid:' docs/video_inspiration.md    -> 6
  - Boss clips:  grep -c -E '^\s*[-*]\s*Boss:' docs/video_inspiration.md   -> 6
- Analysis paragraphs (per-clip analyses):
  - command: grep -i -n '^-\s*Analysis:' docs/video_inspiration.md | wc -l
  - output: 18
- mechanic_gap_analysis.md presence and gap count:
  - command: test -f docs/mechanic_gap_analysis.md && echo "exists" || echo "MISSING"  -> exists
  - command: grep -nEi '^Gap\b|^gap\b' docs/mechanic_gap_analysis.md | wc -l  -> 5
- mechanics per-game (expect 3 per game across N games):
  - command: grep -c -E '^\s*[-*]\s*(Mechanic|Mechanics):' docs/video_inspiration.md  -> 0
- sources JSON top-level keys (games):
  - command: jq 'keys | length' docs/video_inspiration_sources.json  -> 6

Deterministic pass/fail against Definition of Done
--------------------------------------------------
- "Each game has 3 mechanics" (semantic check for per-game mechanics bullets): FAIL
  - Reason: docs/video_inspiration.md lists clips and analyses but does not contain explicit per-game mechanics bullet lists matching the expected label (e.g., "- Mechanics:").
- "2 new games are present": PASS (6 games present, meets >=2 requirement).
- "Each game has 3 clips and 3 analysis paragraphs": PASS (Early/Mid/Boss clips detected per game; 18 analysis paragraphs detected -> 3 per game).
- "mechanic_gap_analysis.md contains 5 gaps with fixes": PASS (grep shows 5 'Gap' entries).

Deterministic verification commands (how to reproduce locally)
--------------------------------------------------------------
Run these commands from the repo root to reproduce the checks and outputs above:

1) Count games:
   grep -nE '^##+' docs/video_inspiration.md | wc -l

2) Verify clips per game:
   grep -c -E '^\s*[-*]\s*Early:' docs/video_inspiration.md
   grep -c -E '^\s*[-*]\s*Mid:' docs/video_inspiration.md
   grep -c -E '^\s*[-*]\s*Boss:' docs/video_inspiration.md

3) Verify analyses:
   grep -i -n '^\s*-\s*Analysis:' docs/video_inspiration.md | wc -l

4) Verify gaps:
   test -f docs/mechanic_gap_analysis.md && echo "exists" || echo "MISSING"
   grep -nEi '^Gap\b|^gap\b' docs/mechanic_gap_analysis.md | wc -l

5) Count source games in JSON (requires jq):
   jq 'keys | length' docs/video_inspiration_sources.json

Notes and recommended remediation (deterministic steps)
-------------------------------------------------------
- Missing mechanics: Add an explicit "- Mechanics:" bullet list under each game heading in docs/video_inspiration.md with exactly three bullets. Example:

  ## Game Name
  - Mechanics:
    - Mechanic 1: short description
    - Mechanic 2: short description
    - Mechanic 3: short description

  This exact label allows deterministic grep: grep -c -E '^\s*[-*]\s*Mechanics:' docs/video_inspiration.md and grep -A3 -E '^\s*[-*]\s*Mechanics:' docs/video_inspiration.md to validate three items.

- After adding mechanics, re-run the commands in the "Deterministic verification commands" section to obtain PASS for the mechanics criterion.

Swarm memory recording (commands)
---------------------------------
If direct access to swarm memory is available, record the result with:

/home/geni/swarm/memory/mem-db.sh write type=R topic=VV2 text="Automated validation run: video_inspiration.md contains 6 games; clips+analyses present; mechanics-per-game MISSING; mechanic_gap_analysis.md contains 5 gaps" choice=success

If direct execution is restricted, run the above command manually from the workstation or copy the line into the memory UI.

Decision (key)
--------------
Prioritize implementing visual layering (Gap 2) and a minimal weakness/break mechanic (Gap 1) as first prototypes because they yield the largest immediate combat feel improvements.

Next action
-----------
- Worker: add explicit "Mechanics" bullet lists (3 items) under each game in docs/video_inspiration.md to satisfy the deterministic check; then re-run the verification commands and update this report.
- Parallel engineering task: open PR to add VISUAL_LAYERS constants and event.visualPriority, and prototype core/algorithms/weakness.ts with unit tests.

Risk
----
Medium — extra-turn mechanics must be integrated deterministically with ReplayService and RNG offsets.

Lesson
------
Prefer exact, machine-detectable labels (e.g., "- Mechanics:") for deterministic documentation validation instead of relying on freeform prose.

Files touched by this round
--------------------------
- docs/validation_report.md (this file)

