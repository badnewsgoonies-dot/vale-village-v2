# Project Phase Plan — High-level outline

This document provides a concise phase plan for the Vale Village v2 project:
- Phase 0: Scaffolding & baseline (setup repo, CI, directories, README)
- Phase 1: Core systems (combat, overworld rendering, state slices)
- Phase 2: Content import (assets, sprites, dialogues, localization)
- Phase 3: Integration & polish (bugfixes, balance, tests)
- Phase 4: Release prep (build, performance tuning, packaging)
- Phase 5: Constants refactor (detailed plan follows)

# Vale Village v2 - Phase 5: Core Constants Refactor

**Date:** January 12, 2026
**Status:** Active
**Objective:** Eliminate "Magic Numbers" in core algorithms by promoting them to named constants in `src/core/constants.ts`, ensuring alignment with `GAME_MECHANICS.md`.

## Context
The Strategic Orchestrator audit (Session `strat-b7dcebc0`) identified numeric literals in `damage.ts`, `status.ts`, `djinn.ts`, and `xp.ts` that obscure game logic and make balancing difficult.

## Execution Plan (Autonomous)

### Phase 1: Preparation (Manual/Orch)
*   **Goal:** Create/Update `src/core/constants.ts` with the new constant definitions.
*   **Target:**
    *   `damage.ts` -> `DAMAGE_CONSTANTS` (Multipliers, Clamp bounds)
    *   `status.ts` -> `STATUS_CHANCE_CONSTANTS` (Poison, Burn, Freeze rates)
    *   `djinn.ts` -> `DJINN_CONSTANTS` (Summon power, Stat bonuses)
    *   `xp.ts` -> `LEVELING_CONSTANTS` (XP Table, Max Level)

### Phase 2: Refactor (Orch)
*   **Goal:** Replace literals in `src/core/algorithms/*.ts` with the new imported constants.
*   **Constraint:** Ensure strict 1:1 replacement to maintain current behavior (except where we explicitly fixed Element Multipliers earlier).

### Phase 3: Verification (Orch)
*   **Goal:** Compile and Run Tests.
*   **Check:** `pnpm typecheck` must pass.
*   **Check:** `tests/unit/core/services/QueueBattleService.test.ts` must still pass (regression check).

## Launch Command
We will use the Strategic Orchestrator to execute this entire flow autonomously.

## High-level Phase Outline
- Phase 0: Scaffolding and baseline setup (project structure, docs, memory integration)
- Phase 1: Core constants refactor and tests
- Phase 2: Overworld rendering rebuild
- Phase 3: Battle system stabilization and balancing
- Phase 4: E2E tests and release prep

