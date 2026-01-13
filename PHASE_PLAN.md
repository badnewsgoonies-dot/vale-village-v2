# Vale Village v2 - Refactoring & Stabilization Plan (Updated)

**Date:** January 12, 2026
**Status:** Active
**Objective:** Fix critical regressions, restore core mechanics, and stabilize the codebase.

---

## Phase 1: Mechanics Restoration (Completed/Verifying)
**Goal:** Restore the elemental advantage/disadvantage system.
- [x] Update `src/core/constants.ts` (1.5x / 0.67x).
- [ ] **Current:** Verifying damage delta via simulator.

---

## Phase 2: EMERGENCY - Overworld Interaction Fix
**Goal:** Fix the regression where players cannot enter houses in the Overworld.
**Context:** Likely caused by recent "Tower" mode integration affecting shared trigger/teleport logic or input handling.

### Diagnosis Steps
1.  **Inspect Trigger Logic:** Check `src/ui/components/overworld-v2/OverworldV2.tsx` and `src/ui/state/overworldSlice.ts`.
2.  **Check Mode Locks:** Verify if the game is stuck in a "TOWER" or "BATTLE" mode state that prevents standard overworld interaction.
3.  **Review Layer Collision:** Check if `VillageLayer` (or equivalent) is correctly identifying door zones.

### Fix Execution
1.  **Isolate the Cause:** Determine if it's Input (button ignored) or Logic (trigger found but action failed).
2.  **Patch:** Revert or adjust the offending logic in `handleTrigger` or the Input System.
3.  **Verify:** Manual test walking into a house.

---

## Phase 3: Core Stability (The "Service" Safety Net)
**Goal:** Create a safety net for `QueueBattleService.ts`.

### Steps
1.  **Scaffold Test Suite:** `tests/unit/core/services/QueueBattleService.test.ts`.
2.  **Critical Path Coverage:** Turn order, Mana updates, Execution.
3.  **Edge Case Fuzzing:** Dead targets, empty queues.

---

## Phase 4: UI Architecture Refactoring
**Goal:** Deconstruct `QueueBattleView.tsx`.

### Steps
1.  **Extract Logic Hook:** `useBattleController`.
2.  **Component Extraction:** `BattleTimeline`, `FloatingTextOverlay`.
3.  **Animation Isolation:** Separate Data from Visuals.