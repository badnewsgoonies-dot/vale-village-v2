# Battle screen — current state (summary)

This document captures the current implementation surface for the game's battle screen, where the Queue-based battle UI lives, what assets/mockups/tests touch it, and known issues to investigate next.

## Overview
- Primary view: QueueBattleView (src/ui/components/QueueBattleView.tsx) — the canonical battle screen container used by App.tsx.
- Rendering is split across presentational components: Battlefield, BattleUnitSprite, BattlePortraitRow, BattleLog, BattleManaBar, BattleActionMenu, BattleOverlay, etc.
- Styling: src/ui/styles/battle-screen.css (used by mockups and production components).

## Key source files
- src/ui/components/QueueBattleView.tsx — main view and UX flow (planning/executing detection, post-battle handling, tower flow integration).
- src/ui/components/battle/LayoutBattle.tsx — layout wrapper that sets data-battle-phase attributes.
- src/ui/components/battle/Battlefield.tsx — battlefield layout and unit placement.
- src/ui/components/BattleUnitSprite.tsx — sprite resolver for player/enemy units.
- src/ui/sprites/manifest.ts and src/ui/sprites/backgrounds.ts — background and sprite resolution helpers.
- src/ui/sprites/mappings/battleSprites.ts & src/ui/sprites/manifest.ts — mappings for enemy/player battle sprites.
- src/ui/state/queueBattleSlice.ts and src/ui/state/battleSlice.ts — UI state slices integrating core services.
- src/core/services/QueueBattleService.ts, src/core/services/BattleService.ts — core battle logic and execution.

## Mockups, screenshots and scripts
- Static mockups: mockups/battle/* (queue-based, target-selection, variants) reference the same CSS and demonstrate expected markup.
- Screenshots: public/screenshots/*-battle.png — captures of runtime battle screens used for visual verification.
- Capture & automation scripts: scripts/capture-battle-ui.ts, scripts/tower-*.ts, playwright tests in tests/e2e/* that navigate into the battle flow and take screenshots.

## Tests exercising the view
- E2E: tests/e2e/enemy-animations.spec.ts, tests/e2e/battle-animations.spec.ts, tests/e2e/enemy-animations-simple.spec.ts — attempt to start tower/story battles and assert sprite/animation presence.
- Unit: tests/unit/validation/battleStateInvariants.test.ts, and many unit tests for services and models exercise battle state correctness.

## Known issues & diagnostics referenced in repo
- ENEMY animation problem: ENEMY-ANIMATION-TEST-REPORT.md and related e2e tests report enemy sprites not visually animating (missing enemy-lunge / enemy-shake classes) or not rendering in certain Tower flows.
- Battle progression: some tests and reports indicate battles can get stuck in the 'planning' phase (UI-derived phase logic and event handling are places to inspect).
- Sprite fallbacks: QueueBattleView and BattleUnitSprite use name-based fallbacks and emit warnings for placeholder sprites (see warnIfPlaceholderSprite utils & battleSprites mappings).
- Several TODOs and warnings in QueueBattleService/BattleService around checkBattleEnd and empty arrays; these surfaced as console warnings in services.

## Quick mapping (where to look first)
1. Visual rendering + assets: src/ui/components/BattleUnitSprite.tsx, src/ui/sprites/mappings/battleSprites.ts, src/ui/sprites/manifest.ts, public/sprites/ and public/screenshots/
2. UI flow & phases: src/ui/components/QueueBattleView.tsx (deriveUIPhase, events handling), src/ui/state/queueBattleSlice.ts
3. Core logic affecting UI: src/core/services/QueueBattleService.ts (transitionToExecutingPhase / executeRound), src/core/services/BattleService.ts (performAction/executeAbility)
4. Tests & reproducer: tests/e2e/enemy-animations.spec.ts + scripts/capture-battle-ui.ts for automation reproductions

## Recommended next steps
- Reproduce failing e2e locally (use the provided playwright scripts) to capture DOM snapshot and console logs when enemy sprites fail to animate/render.
- Add targeted unit/integration tests that assert the sprite mapping returns non-null for known enemy IDs used by failing tests.
- Instrument QueueBattleView to log uiPhase derivation and events consumption when a tower battle starts to validate progression from planning → executing.

## Notes
- There are many documents and mockups referencing the battle screen; this repo intentionally keeps a rich set of static mocks (mockups/battle) to debug visual regressions.
- No changes were made to code in this pass — this is an inventory and recommended next actions file for the next worker.


Handoff: created by worker; include links above when filing followup issues.

---

Update (worker b, Round 2 - 2025-12-30T06:20:35Z)

- Reviewed the created inventory and cross-checked all referenced files, tests, and scripts that touch the battle screen (QueueBattleView, BattleUnitSprite, sprite mappings, QueueBattleService, BattleService, and related tests and mockups).
- Verified that docs/battle-screen-state.md already exists; extended it with this handoff note rather than creating a duplicate file (respecting repo invariant).

What was checked

- Confirmed e2e tests that target enemy animations and battle flow: tests/e2e/enemy-animations.spec.ts and related scripts.
- Confirmed sprite mapping sources and generated lists: src/ui/sprites/mappings/battleSprites.ts and src/ui/sprites/sprite-list-generated.ts.
- Confirmed UI state slices and phase derivation: src/ui/state/queueBattleSlice.ts and src/ui/types/BattleUIPhase.ts (deriveUIPhase).

Small recommended next steps (concrete)

1. Reproduce failing e2e locally and capture DOM + console logs (use scripts/capture-battle-ui.ts or run tests/e2e/enemy-animations.spec.ts with playwright). Capture at these breakpoints: battle view load, before/after execute round, and when events are emitted.
2. Add a unit test asserting getEnemyBattleSprite(...) returns non-null for the enemy IDs used in failing e2e (create tests/unit/sprites/battleSprites.test.ts). This isolates mapping regressions from runtime UI issues.
3. Instrument QueueBattleView.tsx temporarily (log deriveUIPhase, events length, and battle.phase) in a dev-only build to determine whether the UI is stuck in 'planning' or events never enqueue.

Files touched in this round

- docs/battle-screen-state.md (extended handoff notes) — no code changes.

Decision

- Do not create a new document; extend the existing central document to avoid duplication and keep the next worker focused on reproducing and fixing the root cause.

NEXT STEPS for next worker

- Run the enemy animation e2e test with verbose logging and attach the DOM snapshot and console output to a followup issue.
- Implement the small unit test for sprite mapping and gate it behind CI (fast run) to catch mapping regressions early.
- If e2e reproduces the issue consistently, add minimal instrumentation in QueueBattleView to collect uiPhase and events timing for a short-term PR.

RISKS / NOTES

- E2E failures may be flaky due to timing; prefer component-level tests and deterministic unit tests first.
- Do not merge instrumentation into main without gating behind a feature flag or dev-only guard.

End of update by worker b.

---

Watcher prep check

- Note: A watcher prep doc has been added at docs/watcher_prep.md containing commands, artifact locations, and selectors for reproducing battle UI failures.
- Recommendation: If this file is missing in older branches, add docs/watcher_prep.md or a script (scripts/watcher_prep.sh) following the template in docs/watcher_prep.md to document automated reproduction steps and artifacts. Suggested contents:
  1. Command(s) to run the failing e2e with verbose logging (e.g., pnpm test -- tests/e2e/enemy-animations.spec.ts --reporter=list --debug) and where to store screenshots/DOM (./tmp/vv2-screenshots or ./test-artifacts).
  2. Exact selectors and breakpoints to capture: [data-testid="battle-view"], battle-enemy elements, console logs before/after execute round.
  3. Minimal CI job / local script that runs the unit test for sprite mapping (tests/unit/sprites/battleSprites.test.ts) and uploads artifacts for triage.

Concrete next actions (additive to the "NEXT STEPS" above)

1. Create docs/watcher_prep.md containing the commands and artifact locations so automated watchers can reproduce the animation failure consistently.
2. Implement the small unit test for sprite mapping at tests/unit/sprites/battleSprites.test.ts and ensure it runs fast on CI.
3. Run e2e with the watcher_prep steps and attach the DOM + console logs to the issue created for enemy animation failures.

Decision

- Extend the central docs/battle-screen-state.md (this file) rather than creating a duplicate. Keep watcher_prep as a small, focused followup doc so CI/watchers can reproduce and collect artifacts.

Update (worker a, Round 4 - 2025-12-30T06:23:36Z)

- Confirmed docs/battle-screen-state.md already exists and extended it rather than creating a duplicate file (respecting repo invariant).
- Verified presence of key source files: src/ui/components/QueueBattleView.tsx, src/ui/components/battle/LayoutBattle.tsx, src/ui/components/battle/Battlefield.tsx, src/ui/components/BattleUnitSprite.tsx, src/ui/sprites/mappings/battleSprites.ts, src/core/services/QueueBattleService.ts, and src/core/services/BattleService.ts.
- Agreed with worker b's recommended next steps and add concrete run commands for reproducibility:
  1. Run the fast unit test for sprite mapping locally: pnpm test -- tests/unit/sprites/battleSprites.test.ts --runInBand
  2. Run the targeted e2e with verbose Playwright logging and capture artifacts: pnpm test -- tests/e2e/enemy-animations.spec.ts -- --reporter=list --debug
  3. Store artifacts in ./test-artifacts/battle/ with DOM snapshot (+.html) and console.log output (+.log)
- Suggested artifact and test locations (to be created by next worker if needed): docs/watcher_prep.md (commands + artifact dirs) and tests/unit/sprites/battleSprites.test.ts (mapping non-null assertions).

Handoff: appended by worker a. Please follow the exact artifact paths and commands above when reproducing failures to keep triage consistent.

End of update by worker a.
