# Battle UI — Current state (2025-12-30)

Overview

- The project uses a queue-based, deterministic battle system (PR-QUEUE-BATTLE). The primary runtime view is implemented in src/ui/components/QueueBattleView.tsx and its subcomponents.

Key files and locations

- src/ui/components/QueueBattleView.tsx — Main battle screen (planning + executing phases; derives UI phase and coordinates subcomponents)
- src/ui/components/ActionQueuePanel.tsx — Visual queued actions panel
- src/ui/components/BattleActionMenu.tsx — Action menu (attack / psynergy / summon)
- src/ui/components/BattleUnitSprite.tsx — Per-unit battle sprite rendering + fallbacks
- src/ui/components/BattleLog.tsx — Battle event log UI
- src/ui/components/BattleOverlay.tsx — Victory / defeat overlays
- src/ui/styles/battle-screen.css — Battle screen styles (includes animation classes)
- src/ui/sprites/manifest.ts & mappings — Sprite resolution and battle sprite mappings
- src/core/services/QueueBattleService.ts — Queue battle execution logic (emits event stream consumed by UI)
- src/ui/state/queueBattleSlice.ts — Zustand slice that exposes UI-friendly wrappers for queue battles
- tests/e2e/*enemy-animations*.spec.ts — End-to-end checks around battle visuals / animations

Behavior summary

- The UI derives a short-lived "uiPhase": when an events queue is non-empty, the UI treats the view as 'executing' regardless of battle.phase to ensure animations run to completion.
- Planning: players queue actions (one per party slot up to team size). The UI validates mana and targets and enables Execute when the queue is complete.
- Executing: QueueBattleService produces a deterministic sequence of events; the UI consumes and renders these events (floating numbers, sprite state changes, overlays) in order.
- Tower integration: QueueBattleView contains tower-run hooks and calls handleTowerBattleCompleted when a battle finishes so tower state (HP, rewards) can be persisted.

Known issues & evidence

- Enemy animation classes sometimes do not appear during e2e tests (see ENEMY-ANIMATION-TEST-REPORT.md and tests/e2e/enemy-animations.spec.ts). Mockups (mockups/battle/*) and src/ui/styles/battle-screen.css contain expected animation rules.
- BUG-004: UI state de-sync — the battle model can advance to the post-round state before the UI has finished playing event-driven animations (see BUG_REPORT.md). This causes abrupt HP/meter jumps during animations.
- BUG-011: Revival and targeting logic may filter out KO'd units too aggressively, breaking revive-style abilities (see docs/fixes/BUG-011-skeleton.md).
- Sprite fallbacks: BattleUnitSprite emits placeholder IDs when a mapping fails; verify manifest and mappings to ensure coverage for encounter enemy IDs.

Recommendations / Next checks (actionable, prioritized)

1) Validate sprite coverage
   - Run a script that scans data/definitions/encounters.ts against src/ui/sprites/mappings/battleSprites.ts and src/ui/sprites/manifest.ts to list missing sprite entries.

2) Stabilize enemy animation tests
   - Reproduce tests locally and add focused component/unit tests that assert animation-related CSS classes (e.g., enemy-lunge, enemy-shake) are applied while corresponding events are processed.

3) Fix UI/state ordering (medium-term)
   - Audit queueBattleSlice/QueueBattleService: ensure store-level battle state updates that represent the "final" round result are not applied until the UI has consumed the corresponding events, or emit a separate visualComplete signal that the UI waits for.

4) Add observability
   - Add lightweight, opt-in debug logging in QueueBattleView for uiPhase transitions, events queue length, and event processing time to help CI triage intermittent timing failures.

Handoff / Notes

- Generated on 2025-12-30 after scanning source, tests, and mocks.
- Immediate starting points: src/ui/components/QueueBattleView.tsx, src/ui/state/queueBattleSlice.ts, src/core/services/QueueBattleService.ts, src/ui/sprites/manifest.ts, and tests/e2e/enemy-animations.spec.ts.
- Decision: do not create a new duplicate file; extend this canonical docs/compendium/ui/battle.md for future notes and PR references.

Files created/modified

- modified: docs/compendium/ui/battle.md

Watcher prep

- Use the Playwright watcher to reproduce animation flakiness locally:
  1. npm ci
  2. npm run build --if-present
  3. Start the dev server (npm run dev) and confirm the app is reachable, then run:
     npx playwright test tests/e2e/enemy-animations.spec.ts --project=chromium --headed

- For CI reproduction: run the test with --headed and a small slowMo (e.g., --slow-mo=50) to surface timing-sensitive animation class application.

- Notes: these steps assume Node 18+, Playwright installed in devDependencies, and that the app's dev server serves the same assets used in CI. If tests remain flaky, capture a video (--video=on) and attach to the failing run for inspection.



- Reviewed by lane/2 worker a on 2025-12-30T06:14:53Z — no new file created; this document is the canonical battle screen summary for now.
- Reviewed by lane/2 worker b on 2025-12-30T06:15:52Z — performed a quick verification; no duplicate file needed. Added this note and confirmed recommended next steps.
- Next action: consider running the sprite coverage scan referenced above and open an issue if missing sprites are discovered; include the generated report as an attachment.

