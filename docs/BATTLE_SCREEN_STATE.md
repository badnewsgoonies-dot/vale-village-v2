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

Contact / context

- If uncertain about an edge-case invariant, prefer adding explicit schema validation and a unit test rather than leaving a runtime console.warn.

-- end --
