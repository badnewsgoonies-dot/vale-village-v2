GAME MECHANICS - vale-village-v2

Overview
--------
This document summarizes the main gameplay systems implemented in vale-village-v2: the queue-based battle system, progression and leveling, and high-level state management / game loop. The summary is derived from core services and UI state slices under src/core and src/ui/state and validated against schema and service code (BattleState, QueueBattleService, BattleService, TowerService, ReplayService, queueBattleSlice, battleSlice, rewardsSlice, saveSlice).

Battle System (queue-based)
---------------------------
Key files and concepts:
- Core: src/core/models/BattleState.ts, src/core/services/QueueBattleService.ts, src/core/services/BattleService.ts, src/core/algorithms/* (damage.ts, mana.ts, rewards.ts), src/core/validation/battleStateInvariants.ts
- UI/state: src/ui/state/queueBattleSlice.ts, src/ui/state/battleSlice.ts, src/ui/components/QueueBattleView.tsx and supporting UI components (ActionBar, ActionQueuePanel, BattleActionMenu)
- Data/schemas: src/data/schemas/BattleStateSchema.ts

Design summary:
- Queue-based planning: Each player unit has an entry in battle.queuedActions (array of length = team size). Entries are either null (no action queued) or a QueuedAction. queuedActions may contain nulls for dead units; invariants validate length and indices.
- Phases: A battle has phases like 'planning' and 'executing' (and terminal phases 'victory'|'defeat'). UI derives a BattleUIPhase from the battle.phase and event queue.
- Mana & action cost: Team mana pool is computed (calculateTeamManaPool / maxMana) and remainingMana tracks available mana during planning; algorithms/mana.ts implements validation and aggregated costs.
- Round execution: executeRound / performAction in QueueBattleService / BattleService apply queued actions deterministically using a PRNG seeded by a stored rngSeed and RNG stream offsets (core/constants.ts). Execution produces events consumed by the UI (event queue) and updates battle state immutably.
- Turn order & execution indices: battle.turnOrder, battle.currentQueueIndex, battle.executionIndex, battle.roundNumber coordinate which unit/actor acts when executing the queue.
- AI: For non-player actors, AI decisions are produced (makeAIDecision) and routed through the same performAction pipeline so results are consistent.
- End-of-battle: checkBattleEnd determines victory/defeat; on victory RewardsService computes XP/gold/equipment and post-battle flow (postBattleDialogues, recruitment) is triggered by UI slices.
- Determinism & Replay: ReplayService can re-run recorded tapes by replaying player/system inputs against the same seeded RNG stream, ensuring deterministic replays for debugging/testing.

State invariants & validation
-----------------------------
- BattleState is validated in battleStateInvariants and against zod schemas (BattleStateSchema). Key checks include queuedActions length matching team size, valid unit indices, and numeric fields being finite.
- queueBattleSlice.normalizeBattleState enforces safe defaults (currentTurn, roundNumber, currentQueueIndex, executionIndex, maxMana/remainingMana) to avoid UI/runtime crashes.

UI / player flow
----------------
Typical flow:
1. Overworld encounter triggers pre-battle dialogue (if present) or goes directly to team-select (gameFlowSlice).
2. Player configures team and equipment in PreBattleTeamSelectScreen → gameFlowSlice builds a BattleConfig and calls core services to create initial BattleState.
3. setBattle in queueBattleSlice stores a cloned/normalized BattleState and initializes UI trackers (currentMana, maxMana, events, etc.).
4. Player queues actions (queueAction) for each alive unit during 'planning' phase. UI shows queuedActions and remainingMana.
5. When the round is executed (executeRound), QueueBattleService applies queued actions, advances roundNumber, generates events consumed by QueueBattleView for animations, and updates the battle state.
6. On battle end, rewardsSlice.processVictory calls RewardsService to compute rewards and orchestrates the reward screen and post-battle dialogues.

Progression & leveling
----------------------
- XP and leveling are handled by rewards algorithms (src/core/algorithms/rewards.ts) which distribute XP to the active party (even KO'd units) and compute level-ups.
- Tower (gauntlet) mode: src/core/services/TowerService.ts prepares floors by normalizing party levels/equipment for the floor (it uses LevelNormalizationService) so tower battles are balanced; tower state is persisted in towerSlice which keeps HP between fights when configured.
- Unit stats: Unit instances (src/core/models/Unit.ts) contain base stats and battleStats (counters like damageDealt, damageTaken). Djinn states (set/unset/recovery) are stored in team trackers and reset/modified by RewardsService and after battle logic.

Save, persistence and autosave
-----------------------------
- saveSlice and SaveService provide serialization and localStorage persistence for campaign and battle states. saveSlice auto-saves battle snapshots and supports per-slot battle saves.
- SaveService validates saved battle state against BattleStateSchema on load/save and returns explicit Err/Ok results for error handling.

Tower & Special Modes
---------------------
- TowerService orchestrates tower runs: prepareFloorBattle normalizes the party and returns a BattleState suitable for the queue engine; after each floor TowerSlice handles persisting changes to the campaign team and applying optional reward rules.
- Tower runs can preserve or reset Djinn/equipment per options in towerSlice.processVictory.

Key constants, helpers, and algorithms
------------------------------------
- Deterministic RNG: rngSeed stored with battle state; createRNGStream and RNG_STREAMS offsets are used to produce deterministic streams for rounds, ensuring seed isolation between rounds and reproducible results.
- Damage, healing, and mana algorithms: core/algorithms contains specialized modules (damage.ts, healing.ts, mana.ts, rewards.ts) encapsulating domain logic. These are the authoritative source for numerical formulas used in battles.

Observations & Implementation notes
----------------------------------
- queuedActions is central to the UX and domain invariants: many UI components (ActionBar, QueuePanel, QueueBattleView) rely on its shape and null entries for empty slots.
- The code favors immutability: services return new battle state objects; UI slices set cloned/normalized states to avoid mutation bugs.
- Validation and normalization are applied at slice boundaries to protect UI from malformed states (normalizeBattleState in queueBattleSlice).
- Many flows (pre/post-battle dialogues, recruitment) are implemented by wiring encounter IDs to dialogue registries and are invoked by slice event handlers on battle-end.

Recommended next steps for maintainers
-------------------------------------
- Consolidate magic numbers into named constants where not already (some files use numeric literals in data definitions).
- Add unit tests for QueueBattleService edge cases: partial queues, dead-unit queue entries, and mana rounding/overflow.
- Ensure LevelNormalizationService behavior is fully documented and covered by tests for tower difficulty scaling.

References (important files)
---------------------------
- src/core/models/BattleState.ts
- src/core/services/QueueBattleService.ts
- src/core/services/BattleService.ts
- src/core/services/TowerService.ts
- src/core/services/ReplayService.ts
- src/core/algorithms/{damage, mana, rewards, healing}.ts
- src/core/validation/battleStateInvariants.ts
- src/ui/state/queueBattleSlice.ts, src/ui/state/battleSlice.ts, src/ui/state/towerSlice.ts
- src/data/schemas/BattleStateSchema.ts

If deeper, line-by-line extraction or sequence diagrams are needed next, list the specific systems (e.g., "damage calculation chain", "PRNG stream uses per round") and the next worker will produce diagrams/tests.
