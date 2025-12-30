BATTLE SCREEN STATE

Overview

This document is the single source of truth for the in-memory battle screen state consumed by UI components. It documents the canonical shape, key invariants, and where the state is defined and validated in code.

Source files

- Schema (validation): src/data/schemas/BattleStateSchema.ts
- Runtime model & helpers: src/core/models/BattleState.ts
- UI state slice / store: src/ui/state/battleSlice.ts
- Key UI consumers: src/ui/components/battle/* (e.g., Battlefield.tsx, LayoutBattle.tsx, BattleOverlay.tsx, QueuePanel.tsx, BattleManaBar.tsx, BattleLog.tsx, BattlePortraitRow.tsx, BattleUnitSprite.tsx, ActionQueuePanel.tsx, BattleActionMenu.tsx)

Canonical state shape (summary)

Top-level fields (high-level):
- playerTeam: Team
  - The player's team object (units, team metadata).
- enemies: Unit[]
  - Array of enemy units (must have at least one enemy).
- unitById: Map<string, UnitIndex>
  - Performance index mapping unit id -> { unit, isPlayer } for O(1) lookups.
- phase: 'planning' | 'executing' | 'victory' | 'defeat'
  - Current battle phase used by UI to switch screens/controls.
- status: 'ongoing' | 'PLAYER_VICTORY' | 'PLAYER_DEFEAT'
  - End-state or ongoing marker.
- currentTurn: number
  - Turn counter used for status effects and Djinn recovery.
- roundNumber: number
  - Increments each planning phase.
- turnOrder: string[]
  - Ordered array of unit IDs representing action order (validated against known unit IDs).
- currentActorIndex: number
  - Index into turnOrder for the actor whose turn it currently is.
- log: string[]
  - Battle log for the UI (message history).

Queue-based battle fields (specific to the queue system):
- currentQueueIndex: number
  - Which team member the player is currently selecting an action for (0..teamSize-1).
- queuedActions: (QueuedAction | null)[]
  - Array with length equal to team size (MIN_PARTY_SIZE..MAX_PARTY_SIZE). Each element is either null (no action) or:
    - unitId: string
    - abilityId: string | null (null means basic attack)
    - targetIds: string[]
    - manaCost: number (int, schema caps at 10)
  - Note: queuedActions length must match team size; validated in schema.
- queuedDjinn: string[]
  - Djinn IDs marked for activation this round.
- executionIndex: number
  - Which queued action is currently executing during the execution phase.

Mana and Djinn tracking:
- remainingMana: number
  - Current mana pool for the player team (must not exceed maxMana; validated).
- maxMana: number
  - Calculated sum of team mana contributions (see calculateTeamManaPool).
- djinnRecoveryTimers: Record<string, number>
  - Mapping of djinnId -> turns until recovered.

Metadata / legacy fields:
- isBossBattle?: boolean
- npcId?: string
- encounterId?: string (deprecated; prefer meta.encounterId)
- meta?: { encounterId: string; difficulty?: 'normal'|'elite'|'boss' }
- backgroundId?: string, leaderSpriteId?: string (visual guidance)

Important invariants and validations (enforced by BattleStateSchema.superRefine)

- turnOrder must reference only known unit IDs (player units + enemies).
- queuedActions.length must equal playerTeam.units.length (team size).
- queuedActions entries that exist must reference valid unit IDs belonging to the player team.
- currentQueueIndex must be < team size.
- remainingMana must be <= maxMana.
- queuedActions array length is officially clamped by MIN_PARTY_SIZE..MAX_PARTY_SIZE (constants used in schema).

Where to update behavior vs. docs

- Add/modify fields in the schema (src/data/schemas/BattleStateSchema.ts) first; ensure validations cover invariants.
- Update POJO model and helper functions in src/core/models/BattleState.ts (e.g., createBattleState, updateBattleState, calculateTeamManaPool).
- Ensure the UI state slice (src/ui/state/battleSlice.ts) wires state transitions and events correctly and emits expected events (battle-end, encounter-finished).
- Keep the battle UI components in sync with the field names above; prefer reading from the BattleState model or slice rather than deriving ad-hoc values.

Developer notes / decisions

- This doc intentionally mirrors the validated schema and the runtime model to avoid divergence between validation and runtime expectations.
- No magic numbers: constants (e.g., MIN_PARTY_SIZE, MAX_PARTY_SIZE) are referenced from code and should be used in UI constraints rather than hardcoding values here.
- queuedActions uses nullable entries to represent "action not chosen yet"; UI should render empty/selection state for nulls.
- unitById is the preferred lookup mechanism in UI code for deterministic performance; avoid O(n) .find() calls.

Where UI reads the state (non-exhaustive)

- Mana bar: src/ui/components/BattleManaBar.tsx -> remainingMana, maxMana
- Queue/selection panels: src/ui/components/battle/QueuePanel.tsx, ActionQueuePanel.tsx -> queuedActions, currentQueueIndex, queuedDjinn
- Battlefield visuals: src/ui/components/battle/Battlefield.tsx, BattleUnitSprite.tsx -> unitById, playerTeam, enemies, backgroundId
- Turn progression / AI: src/ui/state/battleSlice.ts and core services (BattleService, AIService)

Maintenance and edits

- When adding fields, update all three places (schema, model, slice) and this document.
- When changing invariants, update superRefine in the schema and corresponding runtime guards in updateBattleState.

Concrete constants and helper locations (referenced by code)

- Party size constants: src/core/constants.ts
  - MIN_PARTY_SIZE = 1
  - MAX_PARTY_SIZE = 4
  - These are the canonical bounds used by TeamSchema, BattleStateSchema, and UI validation (do not hardcode numbers in UI).
- Queue helper: src/core/constants.ts -> createEmptyQueue(size: number = MAX_PARTY_SIZE)
  - createEmptyQueue validates size against MIN_PARTY_SIZE..MAX_PARTY_SIZE and returns a readonly array of nulls.
  - createBattleState uses createEmptyQueue(playerTeam.units.length) to initialize queuedActions.
- Mana initialization: src/core/models/BattleState.ts
  - createBattleState computes maxMana = calculateTeamManaPool(updatedTeam) and sets remainingMana = maxMana by default.
- Unit lookup index: src/core/models/BattleState.ts
  - unitById is a ReadonlyMap<string, UnitIndex> built by buildUnitIndex(playerUnits, enemyUnits). Prefer this for O(1) lookups.
- Djinn recovery timers: implemented as a plain object (Record<string, number>) in both schema and model (avoid Map for serialization ease).
- Runtime validation and guards: src/core/models/BattleState.ts -> updateBattleState dynamically imports ../validation/battleStateInvariants and will throw BattleStateInvariantError in dev mode if invariants fail.

Small behavioral notes

- queuedActions is an array whose length must equal playerTeam.units.length; entries may be null to indicate "no action chosen yet" and must be validated against unit IDs belonging to the player team.
- remainingMana is validated to never exceed maxMana by the schema's superRefine.
- turnOrder must reference only known unit IDs (player and enemy unit ids); unknown IDs will cause schema validation issues.

Contact / context

- If uncertain about an edge-case invariant, prefer adding explicit schema validation and a unit test rather than leaving a runtime console.warn.

-- end --

Appendix: concrete symbols and helpers referenced (exact names/locations)

- Constants and helpers (src/core/constants.ts):
  - MIN_PARTY_SIZE (number) and MAX_PARTY_SIZE (number) - canonical party bounds.
  - createEmptyQueue(size: number = MAX_PARTY_SIZE): readonly null[] - returns a properly sized readonly null array and validates size bounds against MIN_PARTY_SIZE..MAX_PARTY_SIZE.
  - RNG_STREAMS and createRNGStream(...) - battle-internal RNG helpers (DO NOT use from UI layer; internal only).

- Schema-level constraints (src/data/schemas/BattleStateSchema.ts):
  - BattlePhaseSchema: enum('planning','executing','victory','defeat').
  - BattleStatusSchema: 'ongoing' | 'PLAYER_VICTORY' | 'PLAYER_DEFEAT'.
  - QueuedActionSchema.manaCost: integer, min 0, max 10 (schema-enforced cap).
  - Super-refinements: BattleStateSchema.superRefine enforces turnOrder ids, queuedActions length matching team size, currentQueueIndex bounds, and remainingMana <= maxMana.

- Runtime model & helpers (src/core/models/BattleState.ts):
  - buildUnitIndex(playerUnits, enemyUnits): ReadonlyMap<string, UnitIndex> for O(1) lookups (preferred by UI).
  - calculateTeamManaPool(team): number - canonical mana calculation; createBattleState uses this for maxMana and remainingMana initialization.
  - createBattleState(...) and updateBattleState(...) - runtime constructors and updaters that maintain invariants and rebuild unitById when units change.
  - getEncounterId(battle) - canonical accessor for encounter id (uses meta.encounterId fallback chain).

Notes / Decisions (non-obvious choices documented):

- UI must treat BattleState as authoritative. Prefer reading from the BattleState model or the ui state slice rather than recomputing values locally to avoid drift.
- RNG utilities (RNG_STREAMS, createRNGStream) are part of core/constants for deterministic battle simulation; these are explicitly internal and should not be used by UI code or to gate rendering decisions.
- queuedActions uses nullable entries intentionally to represent "action not chosen yet"; do not replace with sparse arrays or object maps without updating schema and model.
- Mana cap (manaCost max 10) is a deliberate gameplay constraint surfaced in the schema; UI should enforce this in controls and validators rather than assuming different caps.
- When adding or changing invariants, prefer extending BattleStateSchema.superRefine and adding unit tests rather than relying on console warnings in runtime update paths.

Handoff / Next actions (concrete):

1. Add unit tests for BattleStateSchema.superRefine edge cases: queuedActions length mismatch, currentQueueIndex >= team size, remainingMana > maxMana.
2. Scan UI components (QueuePanel, ActionQueuePanel, BattleManaBar) and replace any ad-hoc .find() lookup of units with unitById.get(id) for performance and deterministic behavior.
3. Ensure battleSlice emits consistent "battle-end" events using BattleStatus ('PLAYER_VICTORY'|'PLAYER_DEFEAT') and document the event contract in battleSlice comments.

Risks / Concerns

- Some older UI modules may still rely on deprecated fields (encounterId top-level). The getEncounterId helper standardizes access but components must be updated to use it to avoid future regressions.
- RNG constants exist; accidental use by UI could create non-deterministic rendering diffs across clients—explicitly calling this out above mitigates the risk.

-- doc update by worker-c (round 3) --

Round 4 — Worker a (investigation & immediate recommendations)

Summary of quick inspection

- Verified this document aligns with the code locations listed above; the canonical schema and runtime model are the single sources of truth.
- Observed two recurring implementation patterns to watch for in UI code: (1) some components may still compute values (e.g., maxMana, queue length) instead of reading model helpers; (2) some lookups use .find() on arrays instead of unitById.get(id).

Immediate, minimal recommendations

1) Prefer model helpers over recomputation
   - UI components should read maxMana/remainingMana from the battle slice or use calculateTeamManaPool(team) during initialization flows. Avoid local ad-hoc mana math to prevent drift.

2) Use unitById for lookups
   - Replace array .find() calls with unitById.get(id) in BattleUnitSprite, QueuePanel, and any place doing repeated lookups for performance and determinism.

3) Queue sizing behavior
   - Ensure createEmptyQueue(playerTeam.units.length) is used to initialize queuedActions when team size is dynamic; do not rely on the default MAX_PARTY_SIZE factory overload in production UI rendering logic.

4) Validation-first changes
   - When adding/changing fields or invariants, update BattleStateSchema.superRefine and add unit tests; prefer schema changes before runtime model changes.

Notes for next worker

- Add the three unit tests listed in the Handoff / Next actions above (queuedActions length mismatch, currentQueueIndex bounds, remainingMana cap) before refactoring UI consumers.
- Search the codebase for ".find(" usages against unit arrays in src/ui/components/battle and replace with unitById lookups where appropriate.

-- doc update by worker-a (round 4) --

Round 5 — Worker b (automated scan updates)

Observations

- MIN_PARTY_SIZE and MAX_PARTY_SIZE are defined in src/core/constants.ts and are used across schema and UI state (confirmed via grep). These are the canonical bounds and should be referenced by UI code via imports rather than hardcoding numbers.
- Core model uses unitById in src/core/models/BattleState.ts and validation paths (src/core/validation/battleStateInvariants.ts); BattleService also uses unitById for actor lookups. Prefer unitById.get(id) in UI consumers for O(1) lookups.
- encounterId is deprecated at the top-level but canonicalized via getEncounterId(battle) (see src/core/models/BattleState.ts). Many consumers correctly use getEncounterId; prefer that accessor to avoid touching deprecated fields.
- Scanned UI files that still perform array lookups with .find(…) which should be refactored to use unitById.get:
  - src/ui/components/QueueBattleView.tsx (multiple target/ability lookups)
  - src/ui/components/BattleActionMenu.tsx (djinn/ability meta lookups)
  - src/ui/components/PreBattleTeamSelectScreenV2.tsx (initial unit mapping)
  These are non-blocking but worth refactoring for determinism and performance.

Next actions (concrete)

1) Add unit tests for BattleStateSchema.superRefine edge cases: queuedActions length mismatch, currentQueueIndex bounds, remainingMana > maxMana.
2) Replace array .find unit lookups in the files listed above with unitById.get(id), ensuring unitById is forwarded from the slice or model where necessary.
3) Run the test suite (unit + schema) to validate the changes before further UI refactors.

-- doc update by worker-b (round 5) --

Round 6 — Worker c (finalization)

Summary of actions performed in this round

- Reviewed Rounds 1-5 and validated the code references listed in the document against the canonical locations.
- Appended clarifications regarding constants, createEmptyQueue signature/return type, and the preferred unitById lookup pattern.
- Prioritized schema-first changes and explicit unit tests before any UI refactors; recorded concrete next steps below.

Concrete next steps (priority order)

1. Add unit tests for BattleStateSchema.superRefine edge cases: queuedActions length mismatch, currentQueueIndex bounds, remainingMana > maxMana.
2. Run the unit test suite and fix any issues surfaced by the new tests.
3. Replace array .find() unit lookups in identified UI consumers (QueueBattleView, BattleActionMenu, PreBattleTeamSelectScreenV2, etc.) with unitById.get(id) and re-run tests.

Decisions made

- Keep this document as the single source of truth for shape and invariants; when fields/invariants change, update schema first, then model, then UI.
- No runtime code changes made in this round: prefer writing tests and validating schema changes before editing runtime logic.

Risks / Notes

- Old consumers may still reference the deprecated top-level encounterId; using getEncounterId(battle) is the recommended canonical accessor.
- Changing schema without tests or coordinated UI updates risks regressions; tests are required before refactors.

-- doc update by worker-c (round 6) --

