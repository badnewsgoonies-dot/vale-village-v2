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

