# Vale Village v2 — Gameplay Profile

## Overview

This document synthesizes the recent swarm memory and repository audit into a concise gameplay profile and prioritized gap list. The canonical machine-readable checklist is docs/gameplay_profile.json; this markdown summarizes key systems, UI flows, confidence scores, and recommended next steps for P0/P1 work.

Generated: 2026-01-11T15:12:20Z


## Core Mechanics (with provenance & confidence)

- Battle system (id: battle_system_queue)
  - Summary: Queue-based planning and deterministic execution using seeded RNG streams and immutable BattleState updates. UI surfaces include QueueBattleView and BattleActionMenu.
  - Provenance: docs/gameplay_profile.json → entries[0]; see src/core/models/BattleState.ts, src/core/services/QueueBattleService.ts, src/core/services/BattleService.ts, src/ui/state/queueBattleSlice.ts
  - Confidence: High

- BattleState invariants & normalization (id: battle_state_validation)
  - Summary: Normalization and schema validation applied at slice boundaries to ensure UI-safe shapes (queuedActions, numeric sanity, indices).
  - Provenance: docs/gameplay_profile.json → entries[1]; see src/core/validation and src/data/schemas (BattleStateSchema)
  - Confidence: High

- RNG determinism & replay (id: rng_determinism)
  - Summary: Per-battle seeded PRNG streams and ReplayService support deterministic execution and test replay.
  - Provenance: docs/gameplay_profile.json → entries[2]; see src/core/random/prng.ts and src/core/services/ReplayService.ts
  - Confidence: High

- Combat algorithms (id: combat_algorithms)
  - Summary: Centralized formulas for damage, mana, rewards kept in core/algorithms for balance and correctness.
  - Provenance: docs/gameplay_profile.json → entries[3]; see src/core/algorithms/*
  - Confidence: Medium (formulas consolidated but require further review for edge cases like revives/immunity)

- UI player flow (id: ui_player_flow)
  - Summary: Overworld → PreBattle → Planning → Execution → Rewards. Encounters trigger battle creation; queuedActions feed execution and UI event queues.
  - Provenance: docs/gameplay_profile.json → entries[4]; key UI: src/ui/components/overworld-v2/OverworldV2.tsx, QueueBattleView.tsx, RewardsScreen.tsx
  - Confidence: High

- Progression & rewards (id: progression_leveling)
  - Summary: Reward processing (XP, items, djinn) applied post-battle with level-up mutation rules; interacts with Tower normalization.
  - Provenance: docs/gameplay_profile.json → entries[5]; see src/core/services/RewardsService.ts and TowerService.ts
  - Confidence: Medium

- Save & persistence (id: save_persistence)
  - Summary: SaveService handles serialization and validation; autosave and manual save flows exist with load-time validation.
  - Provenance: docs/gameplay_profile.json → entries[6]; see src/core/services/SaveService.ts and ui SaveMenu
  - Confidence: Medium

- Tower / Gauntlet mode (id: tower_mode)
  - Summary: LevelNormalizationService normalizes party for tower floors; ensures fairness and caps (MAX_LEVEL constant extracted).
  - Provenance: docs/gameplay_profile.json → entries[7]; see src/core/services/LevelNormalizationService.ts
  - Confidence: Medium

- Menus focus & input (id: menus_focus_and_input)
  - Summary: useFocusRestore and a reference-counted InputLock prevent input leakage and preserve accessibility when overlays open/close.
  - Provenance: docs/gameplay_profile.json → entries[8]; see src/game/systems/InputLock.ts and PauseMenu/SaveMenu
  - Confidence: High

- E2E / testing gate (id: e2e_and_testing_gates)
  - Summary: Heavy visual tests gated via RUN_HEAVY / RUN_STABLE_E2E flags; deterministic PRNG + replay hooks recommended for stable CI.
  - Provenance: docs/gameplay_profile.json → entries[9]; see tests/e2e and ReplayService
  - Confidence: High


## Gameplay Loop

1) Overworld encounter → createEncounter
   - OverworldV2 -> dispatch encounter id -> QueueBattleService.createBattle
   - Player interacts with QueueBattleView to enqueue actions
   - executeRound() resolves queuedActions via QueueBattleService -> emits event queue for UI
   - On victory -> RewardsService.processVictory -> SaveService.autosave -> DialogueChatOverlay -> return to Overworld

## UI Flow

1) Overworld encounter → createEncounter
   - OverworldV2 -> dispatch encounter id -> QueueBattleService.createBattle
   - Player interacts with QueueBattleView to enqueue actions
   - executeRound() resolves queuedActions via QueueBattleService -> emits event queue for UI
   - On victory -> RewardsService.processVictory -> SaveService.autosave -> DialogueChatOverlay -> return to Overworld

2) Menu open/close
   - PauseMenu.open -> InputLock.acquire() -> mount modal (useFocusRestore captures activeElement)
   - PauseMenu.close -> InputLock.release() -> useFocusRestore restores focus to fallbackRef


## Prioritized gaps & issues (P0 → P2)

P0 (urgent)
- Ensure BattleState queuedActions immutability and deep-clone during normalization to avoid in-place mutation bugs (refs: battle_state_validation).
  - Risk: action leakage causing incorrect round resolution. Confidence: High
- Add missing data-testids and focus-restore for PauseMenu/SaveMenu to stabilize E2E tests (refs: menus_focus_and_input).
  - Risk: flaky e2e due to focus/input leakage. Confidence: High

P1 (important)
- Audit revive/immunity/AoE interactions in combat algorithms to ensure correct post-action state (refs: combat_algorithms). Confidence: Medium
- Expand deterministic replay tests to cover edge cases (status effects, multi-target AoE). Confidence: Medium

P2 (longer term)
- Complete schema coverage for all data/definitions (encounters/enemies/maps) and add strict validation gating (refs: data validation). Confidence: Medium
- Review tower normalization caps and ensure no magic-number leaks remain (MAX_LEVEL centralized). Confidence: Medium


## Recommended next steps (concrete)

1. Owners: assign P0 owner to battle invariants (normalizeBattleState) and menu focus restoration (useFocusRestore) — estimated 1–2 dev-days each.
2. Create deterministic replay tests that exercise revives/immunity and AoE edge cases; gate heavy visual tests behind RUN_HEAVY in CI.
3. Populate docs/gameplay_profile.json entries with owners, evidence links (code locations + test names), and a tracking status field (open/in-progress/done).
4. Run memory briefing (python3 /home/geni/swarm/memory/mem-briefing.py) and record decision entries for P0 actions (use mem-db.sh write as needed).


## Cross-references & how to use

- Machine-checklist: docs/gameplay_profile.json — canonical checklist; use it to drive audit automation.
- Use the "id" fields in the JSON when creating tickets or test cases (e.g., battle_system_queue, battle_state_validation).


## Confidence summary

- High: battle system, RNG determinism, menu focus/input, UI flow
- Medium: combat algorithms edge cases, rewards/progression, save/persistence, tower normalization


---

(Prepared from swarm memory and repository inspection; update JSON checklist with owners and statuses to track progress.)

## Final summary & decisions

Decision: Assign P0 owners for "battle_state_validation" (normalizeBattleState) and "menus_focus_and_input" (useFocusRestore/InputLock) to remove flakiness and ensure state invariants.

Next action: Create tickets for the two P0 items, add owners and due dates to docs/gameplay_profile.json, and add deterministic replay tests for revive/immunity/AoE edge cases.

Risk: None immediate; risks are operational (owner assignment) and should be tracked in the tickets.

Lesson: Keep docs/gameplay_profile.json as the canonical machine-readable checklist and update it when owners/statuses change.

## Overview
Vale Village v2 is a compact JRPG with an emphasis on exploration, deterministic queue-based combat, and composable UI overlays. This doc complements the machine-readable checklist (docs/gameplay_profile.json) by mapping the runtime flow and pointing to primary implementation files.

## Gameplay Loop
1. Boot / Main Menu (src/ui/components/MainMenu.tsx, src/ui/components/SaveMenu.tsx)
2. Overworld exploration & interactions (src/ui/components/overworld-v2/OverworldV2.tsx)
3. Encounter trigger -> Battle creation (src/data/definitions/encounters.ts, src/core/services/QueueBattleService.ts)
4. Queue-based combat execution (src/core/services/BattleService.ts, src/core/models/BattleState.ts)
5. Rewards processing & persistence (src/ui/components/RewardsScreen.tsx, src/core/save/ReplayService.ts)
6. Resume exploration / story progression

## Core Mechanics
- Overworld rendering & input: src/ui/components/overworld-v2/OverworldV2.tsx, src/main.tsx
- Combat & action queue: src/core/services/QueueBattleService.ts, src/core/services/BattleService.ts
- Battle state model & normalization: src/core/models/BattleState.ts, src/core/services/LevelNormalizationService.ts
- Data definitions & validation: src/data/definitions/*, src/data/validateData.ts
- UI state & slices: src/ui/state/*, src/store/gameStore.ts

## UI Flow
MainMenu -> Overworld -> (PauseMenu | InventoryModal | Settings) -> Encounter -> QueueBattleView -> BattleService -> RewardsScreen -> Overworld

(References above point to the primary files to inspect for each subsystem.)
