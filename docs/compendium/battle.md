# Battle Screen — Current State (Overview)

Summary of the current battle UI, code locations, and known gaps (captured 2025-12-30).

## Key UI components

- QueueBattleView (src/ui/components/QueueBattleView.tsx) — main battle screen container; derives UI phase and coordinates battlefield, action menu, portraits, mana bar, and overlays.
- Battlefield, LayoutBattle, BattleOverlay, BattleLog, BattleActionMenu, BattleManaBar, BattlePortraitRow, BattleUnitSprite — presentational components under src/ui/components/battle and root ui/components.
- Styles: src/ui/styles/battle-screen.css and several component CSS files (pre-battle, post-battle).
- Sprites/mappings: src/ui/sprites/mappings/battleSprites.ts and src/ui/sprites/manifest.ts manage battle sprite resolution.

## State and services

- UI state slices: src/ui/state/queueBattleSlice.ts, src/ui/state/battleSlice.ts, src/ui/state/queueBattleSlice.ts control battle flow and are the primary integration surface for the UI.
- Core services: src/core/services/BattleService.ts and src/core/services/QueueBattleService.ts implement deterministic queue-based combat logic; BattleState model in src/core/models/BattleState.ts.

## Tests, mocks and artifacts

- End-to-end tests: tests/e2e/* include visual and animation checks (enemy animation tests exist and have reported issues).
- Unit tests: src/core and tests/unit include extensive validation (battleStateInvariants.test.ts).
- Mockups: mockups/battle/*.html demonstrate static battle mockups (target selection, queue-based planning).
- Screenshots: public/screenshots/* and scripts/capture-battle-ui.ts for automated captures.

## Known issues / notes (from repo signals)

- Enemy animation tests have historically flagged that enemy-lunge/enemy-shake classes do not always appear during automated runs (see tests/e2e/enemy-animations.spec.ts and ENEMY-ANIMATION-TEST-REPORT.md).
- Some UI/test gaps: automated e2e sometimes stalls in pre-battle/team-select; tests contain fallbacks and screenshots to investigate flaky transitions.
- The project uses deterministic battle logic (simulator scripts in scripts/battleSimulator.ts), so reproducing battle-state bugs should be reproducible via the simulator.

## Decision (placement)

- File created at docs/compendium/battle.md to centralize battle UI documentation alongside compendium docs; a later follow-up can move it to docs/compendium/ui/battle.md if a dedicated ui/ directory is preferred.

## Next actions (recommended)

1. Add component-level notes (props/contracts) for BattleUnitSprite and QueueBattleView focusing on sprite resolution and uiPhase derivation.
2. Create a short checklist for e2e flaky failures: capture DOM snapshot when enemy sprites missing, log battle.phase and events count.
3. If desired, move this file into docs/compendium/ui/ and update links in README.
4. Implement a watcher_prep utility (suggested path: src/ui/sprites/watcher_prep.ts) — a runtime and CI-friendly validator that scans the sprite manifest, reports missing/undefined sprite keys, and emits structured diagnostics (console warnings + machine-readable JSON) so tests can fail fast and debugging is reproducible. Note: watcher_prep is not present in the repository and should be created as the next implementation task; it should avoid any randomization and rely only on the canonical sprite manifest and constants.

---

## Component reference: QueueBattleView

- Path: src/ui/components/QueueBattleView.tsx
- Role: container that derives uiPhase from battleSlice and passes resolved sprite identifiers to child components.
- Key props/contracts:
  - battleId: string — canonical identifier for current battle (no nulls).
  - uiPhase: 'lobby'|'planning'|'resolution'|'results' — derived, not passed from parent.
  - onActionSelect(actionId: string): void — invoked when player selects queued action.
- Important notes: QueueBattleView must not compute random values; any deterministic simulation must come from BattleService.

## Component reference: BattleUnitSprite

- Path: src/ui/components/battle/BattleUnitSprite.tsx
- Role: presentational: receives resolved sprite key and renders <img> with alt and aria labels.
- Key props/contracts:
  - spriteKey: string — must be validated against sprite manifest (use constants from src/ui/sprites/manifest.ts).
  - facing: 'left'|'right'
  - animationState?: 'idle'|'attack'|'hurt'|'dead'
- Rendering rules: No fallback randomization; if spriteKey is missing, render a clearly visible placeholder and emit a console.warn for diagnostics.

## E2E flaky-failure checklist (for test automation)

- When a missing enemy animation is detected:
  1. Capture full DOM snapshot (tests/e2e/helpers/captureDomSnapshot.ts).
  2. Capture current battle state: battle.phase, queue length, event log length (serialize battleSlice).
  3. Capture computed CSS classes for the offending unit element (classList).
  4. Save screenshots and attach to CI artifact.
- Add a guard in tests to fail fast with a clear diagnostic message when sprite resolution returns undefined.

## Handoff notes

- Decision: keep this doc under docs/compendium for discoverability; move to docs/compendium/ui/ when UI docs grow beyond one page.
- Non-obvious decision: Placeholder rendering chosen over silent failure to make UI/test failures visible and reproducible.
- Follow-up tasks: implement runtime validation utility for sprite manifest to centralize checks (suggested file: src/ui/sprites/validateManifest.ts).

## Investigation: Current Battle Screen State (detailed)

- Snapshot date: 2025-12-30T06:23:30Z (UTC).
- Entry points: src/ui/components/QueueBattleView.tsx -> LayoutBattle.tsx -> src/ui/components/battle/* (Battlefield, BattleActionMenu, BattleManaBar, BattlePortraitRow, BattleUnitSprite).
- Canonical state slices: src/ui/state/battleSlice.ts (primary), src/ui/state/queueBattleSlice.ts (planning/queue operations). Avoid duplicating state across slices; prefer selectors that read from the canonical battleSlice.
- Sprite system: src/ui/sprites/manifest.ts provides the canonical mapping; keys enumerated in src/ui/sprites/mappings/battleSprites.ts. Recommend promoting an exported constant (e.g. SPRITE_KEYS) and using it for prop typing and runtime validation in BattleUnitSprite.
- Deterministic logic source: src/core/services/BattleService.ts (simulation) — all UI-driven animations and resolution must be derived from BattleService outputs, not randomized UI code.
- Tests & flakiness: tests/e2e/enemy-animations.spec.ts often exposes missing class toggles; add a validateManifest unit test and a small runtime checker to make sprite resolution failures fail fast with structured diagnostics.
- Suggested files to review / next edits:
  - src/ui/components/QueueBattleView.tsx
  - src/ui/components/battle/BattleUnitSprite.tsx
  - src/ui/sprites/manifest.ts
  - src/ui/sprites/mappings/battleSprites.ts
  - tests/e2e/enemy-animations.spec.ts

- Minimal, non-invasive next implementation: create src/ui/sprites/validateManifest.ts that reads the manifest, confirms every used spriteKey has an entry, and exports a function that tests and logs structured JSON diagnostics (no randomness, pure validation).

