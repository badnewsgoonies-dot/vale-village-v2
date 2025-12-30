# Battle Screen State (single source of truth)

This document captures the current implementation and responsibilities of the battle screen (UI + state + services) as of the codebase snapshot. It is intended as a compact reference for engineers working on battle UI, state flow, and integrations (Tower vs Story battles). Keep this file as the canonical doc for battle-screen concerns.

---

## High-level architecture

- UI entrypoint: src/ui/components/QueueBattleView.tsx — main presentational/container component for the queue-based battle view used for story and tower battles.
- Layout wrapper: src/ui/components/battle/LayoutBattle.tsx — applies battle-phase attribute and base layout (.battle-screen).
- Key presentational components:
  - QueueBattleView: coordinates layout, derives UI phase, coordinates event processing and overlays.
  - Battlefield: src/ui/components/battle/Battlefield.tsx — battlefield grid and unit placement.
  - BattleUnitSprite: src/ui/components/BattleUnitSprite.tsx — resolves battle sprites via sprite mappings.
  - BattlePortraitRow, BattleActionMenu, BattleManaBar, BattleLog, ActionQueuePanel — modular pieces for player controls, portraits, mana, and log.
  - BattleOverlay / VictoryOverlay / DefeatOverlay / PostBattleCutscene — post-battle flows and modal overlays.

## State sources

- Core canonical model: src/core/models/BattleState.ts — defines BattleState, turn order, queue, metadata.
- Zod schema: src/data/schemas/BattleStateSchema.ts — runtime validation of battle JSON (used when loading/saving/replaying).
- Core services:
  - Queue-based orchestration: src/core/services/QueueBattleService.ts — planning -> executing -> result transitions and event generation.
  - Core action performer: src/core/services/BattleService.ts — performs individual actions, damage, status effects.
  - Encounter creation: src/core/services/EncounterService.ts — maps encounter data into an initial BattleState.
- UI state slices (Zustand): src/ui/state/queueBattleSlice.ts and src/ui/state/battleSlice.ts — local UI store wrappers used by components.
- App-level flow: src/ui/state/gameFlowSlice.ts — controls pendingBattle, confirmBattleTeam, and mode transitions (overworld -> pre-battle -> battle).

## Invariants & validation

- Battle invariants are explicitly validated in src/core/validation/battleStateInvariants.ts. This file throws BattleStateInvariantError when invariants (e.g., turn order consistency, mana bounds, HP invariants) are violated — these are root-cause checks and should not be bypassed.
- Tests and services depend on deterministic behavior; RNG is handled via explicit RNG streams and seeds (see core constants and Save/Replay services).
- Do NOT use random or hacky workarounds in UI code; always surface problems in services and fix the failing invariant.

## UI phase mapping and event handling

- UI phase (planning/executing/victory/defeat/idle) is derived using src/ui/types/BattleUIPhase.ts (deriveUIPhase) and further refined in QueueBattleView to treat presence of pending events as 'executing'.
- QueueBattleView reads events[] from the store; when events exist UI enters executing and the view consumes events to animate and apply visual FX.
- When battle completes, QueueBattleView triggers processVictory (through rewards slice) or tower-specific completion handlers (handleTowerBattleCompleted) depending on battle.meta or tower status.

## Visual assets & sprite resolution

- Sprite mappings live under src/ui/sprites (manifest.ts, battleSprites.ts, mappings/*). BattleUnitSprite resolves a spriteId then warns on placeholder via warnIfPlaceholderSprite util.
- Background selection: QueueBattleView chooses battle background using battle.meta/backgroundId and Tower floor override logic (see getBackgroundPath usage in QueueBattleView).

## Saving, replay, and deterministic runs

- Save keys and quick-save for battle state are handled in src/core/services/SaveService.ts and UI save slices — battle saves are validated via BattleStateSchema.
- Replay support exists: src/core/save/ReplayService.ts can rehydrate battle state from a tape and run deterministically.
- RNG is deterministic via explicit seeds and RNG stream offsets (see core/constants.ts and services that accept rngSeed). Do not reintroduce ad-hoc Math.random anywhere.

## Tower vs Story battle differences

- Tower battles (Battle Tower) have slightly different UX and flow: Tower flow may preserve team HP between floors, handle persistent stats, and route rewards differently (see src/ui/state/towerSlice.ts and src/core/services/TowerService.ts).
- QueueBattleView contains flags and helpers to detect tower runs (towerStatus === 'in-run') and bypass the global rewards flow in favor of tower-run handlers.

## Notable constants and conventions

- Battle constants are centralized in src/core/constants.ts under BATTLE_CONSTANTS (damage multipliers, minimum damage/healing, revive percentages, etc.).
- UI uses a small set of z-index constants and CSS classes under src/ui/styles/battle-screen.css; prefer referencing named constants or exported enums where available rather than hard-coded numbers.
- Do not embed 'magic numbers' in the UI or services — if a cross-cutting numeric value is needed, add a named constant in core/constants.ts or a UI constants module.

## Known invariants to respect when modifying code

- A BattleState must have at least one enemy and valid player team (QueueBattleService and BattleService check and error out).
- queuedActions length must align with playerTeam.units length.
- remainingMana and maxMana must be non-negative and bounded by BATTLE_CONSTANTS values.
- Event queue ordering and turnOrder arrays must remain consistent; use provided helpers in core/models/BattleState.ts to build/update state instead of mutating directly.

## Developer guidance / best practices

- Fix root causes in services when UI shows inconsistent behavior; e.g., if UI shows unexpected nulls, trace back to EncounterService, QueueBattleService, or setBattle calls in gameFlowSlice.
- Use the Zod schema (BattleStateSchema) to validate any externally-sourced battle JSON (replay, save) before applying it.
- Add constants to core/constants.ts for any shared numeric tuning parameter; document the constant with a short rationale.
- When adding UI animations tied to event timing, expose a speed multiplier via useBattleSpeed() (already present) rather than sprinkling timeouts across components.

## Handoff / non-obvious decisions (commit notes)

- Queue-based battle engine (planning + executing) was chosen to support simultaneous action selection and deterministic interleaving by SPD; this impacts how UI must present queued actions (ActionQueuePanel and BattlePortraitRow).
- Post-battle rewards flow intentionally separates Tower vs Story handling: tower flows call handleTowerBattleCompleted and may preserve team HP; Story flows trigger processVictory -> rewards slices.
- Event-driven UI (events[] in the store) is the single source for animation-driven transitions; do not duplicate event consumption elsewhere.

## Next tasks (recommended)

1. Add a short automated test that validates QueueBattleView correctly transitions from planning -> executing when an event is queued (unit test at component level or slice-level).
2. Centralize any hard-coded z-index or timing constants used in QueueBattleView into a small battle-ui-constants.ts to reduce UI drift.
3. Audit warnIfPlaceholderSprite warnings and add missing sprite mappings for high-priority enemies (tower bosses) to avoid runtime placeholders.

## Risks and blockers

- If BattleState invariants are violated at runtime, the code throws BattleStateInvariantError; UI should surface actionable logs rather than failing silently.
- Sprite assets missing will show placeholder warnings but not crash; still consider adding CI linting for missing sprite mappings if placeholder rate is high.

---

Commit/handoff note: created docs/BATTLE_SCREEN_STATE.md as the single source of truth for the battle screen. This file intentionally avoids implementation details that will rot quickly (line numbers, ephemeral constants) and focuses on responsibilities, invariants, and next actionable items.

Review notes (worker b, round 2):

- Searched repository for a referenced watcher_prep (per previous handoff); no file or symbol named "watcher_prep" was found (grep returned no matches). If watcher_prep is expected, its intended location and role should be clarified so it can be added or referenced correctly.
- Verified the key files and services cited in this document exist at the documented paths (QueueBattleView, LayoutBattle, Battlefield, BattleUnitSprite, QueueBattleService, BattleService, BattleState model, BattleStateSchema, UI slices, sprites manifest and mappings, core constants). No mismatches were discovered.
- No code changes were made; this edit is strictly a documentation extension in accordance with the task constraints.

Handoff guidance / next concrete actions:

1. If watcher_prep is required by the workflow, add it under scripts/ or dev-tools/ with a short README describing its purpose and invocation (e.g., scripts/watcher_prep.sh or tools/watcher_prep.ts), and update this document with its path and responsibilities.
2. Implement the recommended unit test that validates QueueBattleView transitions from planning -> executing when an event is queued (see "Next tasks"). Prefer a slice-level test first to keep it deterministic and fast.
3. Consider adding a short CI lint that warns on missing sprite mappings for boss enemies to reduce runtime placeholders.

Note: Changes in this round intentionally limited to this documentation file to maintain the document as the canonical source for battle-screen concerns.
