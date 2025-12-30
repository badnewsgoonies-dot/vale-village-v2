# Watcher prep for battle UI failures

This document provides commands, artifact locations, and selectors for reproducing and capturing failures related to the battle screen (enemy animations / stuck-in-planning flows).

Artifact directory
- ./test-artifacts/battle/
  - DOM snapshots: {timestamp}-dom.html
  - Console logs: {timestamp}-console.log
  - Screenshots: {timestamp}-screenshot.png

Fast unit test (sprite mapping)
- pnpm test -- tests/unit/sprites/battleSprites.test.ts --runInBand
  - Purpose: assert getEnemyBattleSprite(...) returns non-null for known enemy IDs used by failing e2e.

Targeted e2e reproduction (Playwright)
- pnpm test -- tests/e2e/enemy-animations.spec.ts -- --reporter=list --debug
  - Collect artifacts into ./test-artifacts/battle/ and include the Playwright trace if available.

Quick capture script usage (if available)
- scripts/capture-battle-ui.ts (if present) — run with the project's node/ts-node setup to capture DOM and screenshots during battle flows.

Selectors & breakpoints to capture
- Battle view root: [data-testid="battle-view"]
- Enemy units: elements with class or data attr matching "battle-enemy" or data-testid="battle-enemy"
- Capture points: (1) after QueueBattleView mounts / battle loads, (2) immediately before executeRound / transition to executing, (3) after executeRound completes.

Recommended capture steps
1. Clear ./test-artifacts/battle/ or create timestamped subdir.
2. Run the fast unit test to ensure sprite mappings are valid.
3. Run the targeted e2e with --debug and capture DOM (+.html), console output (+.log) and screenshots (+.png) at the breakpoints above.
4. Attach artifacts to the followup issue and include the failing test name, branch, and exact command used.

Notes
- Instrumentation (temporary logs) in QueueBattleView.tsx should be gated behind a dev-only guard or a feature flag; do not commit long-lived noisy logging to main branches.
- Prefer adding a deterministic unit test for sprite mapping before attempting flaky e2e-based fixes.
