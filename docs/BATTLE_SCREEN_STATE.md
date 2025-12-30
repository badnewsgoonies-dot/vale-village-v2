# Battle Screen — Current UI State

This document captures the current structure, components, props, and known issues of the battle screen UI as implemented in the repository (src/ui/*). It is based on the battle UI components, types, slices, and related utilities found in the codebase.

---

## Overview

The project implements a queue-based battle UI (PR-QUEUE-BATTLE) and several auxiliary views (pre-battle, reward flow, tower-specific flows). The main battle screen view used for gameplay is QueueBattleView and it composes a set of presentational components to show the battlefield, portraits, action queue, mana, and overlays.

Key files to inspect for behavior and wiring:
- src/ui/components/QueueBattleView.tsx — central battle view (planning/executing phases, post-battle handling)
- src/ui/components/battle/LayoutBattle.tsx — layout wrapper for battle screen (data-battle-phase attr)
- src/ui/components/battle/Battlefield.tsx — battlefield sprite layout
- src/ui/components/battle/BattleOverlay.tsx — victory/defeat overlay UI
- src/ui/components/battle/BattleLog.tsx — battle log
- src/ui/components/battle/BattleUnitSprite.tsx — sprite rendering for units/enemies
- src/ui/components/BattleActionMenu.tsx — command selection / ability selection
- src/ui/components/BattlePortraitRow.tsx — row of unit portraits / current unit focus
- src/ui/components/QueuePanel.tsx & ActionQueuePanel.tsx — queued action display & controls
- src/ui/components/BattleManaBar.tsx — mana bar and remaining mana display
- src/ui/styles/battle-screen.css — related battle CSS

State & services involved:
- src/ui/state/queueBattleSlice.ts — primary UI state slice for queue battle
- src/ui/state/battleSlice.ts — older/alternative battle slice (integration points exist)
- src/ui/state/battleConfig.ts — pre-battle configuration and validation helpers
- src/core/services/QueueBattleService.ts — core queue-battle algorithms used by UI slices
- src/core/services/BattleService.ts — battle lifecycle helpers and validations
- src/core/models/BattleState.ts — canonical battle domain model (phase/status/etc.)
- src/core/services/EncounterService.ts — builds a BattleState from encounter data

Sprite & assets:
- src/ui/sprites/manifest.ts — resolution logic for battle sprites (player vs enemy, states)
- src/ui/sprites/mappings/battleSprites.ts — player/enemy mapping helpers and fallbacks
- src/ui/sprites/backgrounds.ts — background lookup for battles
- src/ui/sprites/utils/warnIfPlaceholderSprite.ts — warns when placeholder sprites are shown

---

## Components and Responsibilities

This section enumerates battle UI components and the key props they expect (derived from src/ui/components/battle/types.ts).

- LayoutBattle
  - Props: { children: ComponentChildren; phase: 'planning'|'executing'|'victory'|'defeat' }
  - Responsibility: page-level wrapper; sets data attributes used for CSS and global layout.

- QueueBattleView
  - Not a single typed prop component (reads from Zustand store).
  - Responsibility: orchestrates the battle view, derives UI phase (deriveUIPhase), handles transitions (victory/defeat), tutorial prompts, tower special-cases, and hooks into rewards flow.

- Battlefield (BattlefieldProps)
  - Props: { playerUnits: UnitVM[]; enemyUnits: UnitVM[]; targetingMode: boolean; onSelectTarget?: (unitId: string)=>void }
  - Responsibility: render battle unit sprites and enable target selection.

- BattleUnitSprite
  - Props: (unitId / spriteId / state / size) — resolves to sprites via manifest and mapping helpers.
  - Responsibility: pick correct battle sprite (player or enemy) and render <img> with fallbacks; uses warnIfPlaceholderSprite for missing assets.

- BattlePortraitRow
  - Props: { units: UnitVM[]; ... } (derives selection, active portrait index)
  - Responsibility: show small portraits for party and allow quick navigation / focus to current actor.

- BattleActionMenu / CommandPanel / AbilityPanel
  - Props (CommandPanelProps): { currentUnit: UnitVM|null; selectedCommand: CommandType|null; coreAbilities: AbilityVM[]; djinnAbilities: AbilityVM[]; onCommandSelect; onSelectAbility }
  - Responsibility: primary command selection (attack/psynergy/djinn), ability selection, show ability metadata and locked reasons.

- QueuePanel (QueuePanelProps)
  - Props: { roundNumber: number; queueSlots: ActionSlotVM[]; mana: ManaVM; canExecute: boolean; targetingMode: boolean; onSelectSlot; onClearSlot; onPrevUnit; onNextUnit; onExecuteRound }
  - Responsibility: display planned actions, per-slot summaries, current mana consumption and execute round flow.

- DjinnPanel
  - Props: { djinns: DjinnVM[]; onSelectDjinn: (djinnId:string)=>void }
  - Responsibility: list Djinn and their states (set/standby/recovery) and allow selection for actions.

- BattleManaBar (BattleManaBarProps)
  - Props: { current: number; max: number; overBudget: boolean } (uses ManaVM)
  - Responsibility: visualizes mana usage and budget constraints.

- BattleLog
  - Props: { entries: BattleLogEntry[] }
  - Responsibility: render chronological textual log of events (renderEventText lives in ui/utils/text.ts)

- BattleOverlay (BattleOverlayProps)
  - Props: { status: 'ongoing'|'victory'|'defeat'; rewards?: BattleRewardsVM; onContinue?; onReturnToVillage?; onRetry?; onReturnToTitle? }
  - Responsibility: show post-battle overlay (victory/defeat) and actions.

- PostBattleCutscene / VictoryOverlay / DefeatOverlay
  - Responsibility: cinematic sequences and reward screens that segue into rewards/rewind flows.

---

## View Models (from types.ts)

Important VM shapes used by the UI components (summarized):
- UnitVM: { id, name, element, hp?, maxHp?, statuses: StatusEffectVM[], isSelected, isKo, isEnemy }
- AbilityVM: { id, name, manaCost, targeting, source, sourceLabel, description, isLocked, lockedReason }
- DjinnVM: { id, name, element, state: 'set'|'standby'|'recovery', turnsRemaining?, summonDescription, isSelectable }
- ActionSlotVM: { unitId, unitName, summary, manaCost, isCurrent, isEmpty, isKo }
- ManaVM: { current, max, overBudget }
- BattleLogEntry: { id, text, timestamp }

These VMs intentionally decouple UI from core BattleState so the presentational layer is easier to test and reason about.

---

## Runtime & UX Notes

- UI Phase derivation: QueueBattleView uses deriveUIPhase(battle.phase) with a small UI phase enum (src/ui/types/BattleUIPhase.ts) and treats events presence as 'executing'.
- Battle speed: useBattleSpeed hook controls animation timing, bound to settings (SettingsScreen -> Battle Speed). Use S key to cycle speed in QueueBattleView.
- Tower-specific flows: Tower battles can short-circuit some flows (QueueBattleView checks isTowerBattle and defers reward handling to tower slice). There are tutorial gating flags (e.g., tutorial:tower-battle-controls).
- Sprite resolution: BattleUnitSprite consults getPlayerBattleSprite/getEnemyBattleSprite; if unresolved it shows a placeholder and calls warnIfPlaceholderSprite to log the issue.
- Pre-battle & team selection: PreBattleTeamSelectScreenV2 handles building BattleConfig and validating via src/ui/state/battleConfig.ts before creating the BattleState via EncounterService.
- Replay / save: battle state can be saved & restored by ReplayService and SaveService; UI slices persist battle snapshot to localStorage (saveSlice). Save/Load can emit warnings on corrupted data.

---

## Known Issues / Observations (from code comments and logging)

- Missing sprites and placeholders
  - warnIfPlaceholderSprite exists and emits warnings for missing battle sprites (placeholder prefixes: missing-battle-sprite-, missing-compendium-enemy-).
  - Many generated sprite lists exist but custom enemy/portrait name mismatches can still cause fallback images.

- Console errors used liberally as guardrails
  - EncounterService and BattleService log console.error / console.warn on invalid inputs ("Failed to start battle", "Battle requires at least one enemy", "checkBattleEnd called with empty enemies array!"). These are indications of runtime guards but may surface noisy logs during development or bad inputs from other code.

- Save / Replay robustness
  - SaveService / ReplayService validate battle snapshots and will Err out on malformed data; UI slices log warnings when parsing fails.

- Overworld V2 transition notes
  - OverworldV2.tsx contains a note: it "doesn't use tile triggers yet" and has interiorBattleTriggeredRef to avoid double-starting battles in certain layer interactions — this indicates incomplete integration paths and potential edge cases when starting battles from V2 overworld.

- Tower flow complexity
  - QueueBattleView and towerSlice contain explicit tower-related branches (e.g., handleTowerBattleCompleted). Mixing tower-run persistence (HP carryover, auto-save) with story battles increases complexity and is a common source of subtle bugs.

- Performance and animation concerns
  - Battle speed and heavy sprite animations are client work; the code includes hooks to adjust speed but expect occasional jank if many animations / DOM updates coincide (large sprite lists, portrait updates, and floating numbers).

- Target retargeting logic
  - QueueBattleService contains logic to retarget if a target is KO'd; comments indicate careful handling but also mention complexity (preserve ability target type). This is often a source of edge-case bugs for multi-target or chained actions.

---

## Quick Checklist for Future Changes or Debugging

- If a unit's sprite is missing: check sprite mappings (src/ui/sprites/mappings/battleSprites.ts) and warnIfPlaceholderSprite logs.
- If battles fail to start: inspect EncounterService.createBattleFromEncounter and gameFlowSlice.confirmBattleTeam for validation failures and logged errors.
- If save/restore fails: reproduce with localStorage keys (vale-v2/battle-state or slots). See src/ui/state/saveSlice.ts and core/save/ReplayService.ts logs.
- If tower run behaves differently: search for tower-related branches in queueBattleSlice and towerSlice; tower tutorial gating flags are also relevant.

---

## References (important files)
- src/ui/components/QueueBattleView.tsx
- src/ui/components/battle/LayoutBattle.tsx
- src/ui/components/battle/Battlefield.tsx
- src/ui/components/battle/BattleOverlay.tsx
- src/ui/components/battle/BattleLog.tsx
- src/ui/components/battle/BattleUnitSprite.tsx
- src/ui/components/battle/types.ts
- src/ui/state/queueBattleSlice.ts
- src/ui/state/battleConfig.ts
- src/core/services/QueueBattleService.ts
- src/core/services/BattleService.ts
- src/ui/sprites/mappings/battleSprites.ts
- src/ui/styles/battle-screen.css


---

If useful, the next step can be extracting prop signature snippets (copy/paste) for each component into this file; currently the types.ts file already contains the canonical component props and VMs used above.