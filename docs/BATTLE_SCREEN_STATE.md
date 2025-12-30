# Battle Screen & State - Single Source of Truth

This document catalogs the current battle UI implementation, hardcoded layout/pixel constants ("magic numbers"), unit sizing/positioning, and the battle state schema used across the codebase. It is intended to be the single reference for designers and engineers when changing the battle screen, animations, or state transitions.

---

## Files inspected (primary)
- src/ui/components/QueueBattleView.tsx
- src/ui/components/battle/Battlefield.tsx
- src/ui/components/battle/LayoutBattle.tsx
- src/ui/components/battle/BattleOverlay.tsx
- src/ui/components/BattleUnitSprite.tsx
- src/ui/styles/battle-screen.css
- src/core/models/BattleState.ts
- src/store/gameStore.ts
- src/ui/state/queueBattleSlice.ts
- src/ui/state/battleSlice.ts
- src/core/services/QueueBattleService.ts
- src/ui/constants/animationTiming.ts

If other files reference battle UI/layout they should reference this doc first.

---

## 1) Screen dimensions and grid layouts (hardcoded values)
Found explicit pixel/grid constants (file:line) that must be centralized:

- Overall battle surface (src/ui/styles/battle-screen.css):
  - .battle-screen width: 1280px; height: 720px; padding: 8px 12px; gap: 4px; (lines: 37-49)
  - grid-template-rows: 80px 220px 1fr 210px (lines: 45)
  - grid-template-columns: 1fr (line: 46)

- Top/turn order / portrait strip:
  - .turn-order-unit width/height: 40px (lines: 61-63)
  - .turn-order gap: 6px (line: 57)

- Unit card and list layout:
  - .unit-card grid-template-columns: 40px 1fr and grid-template-rows: auto auto auto (lines: 121-123)
  - .unit-sprite width/height: 36px (lines: 144-146)
  - .unit-card font-size: 11px and many small typographic sizes (lines: 128, 106, etc.)

- Battlefield region:
  - .battlefield padding: 12px (line: 269)
  - .battlefield-inner uses padding: 12px and layout (lines: 263-270)
  - .battlefield-unit width/height: 48px (lines: 279-282)
  - .battlefield-inner justify-content: space-between (line: 267)

- Bottom row (command/queue/mana/log):
  - .bottom-row grid-template-columns: 0.8fr 1.1fr 0.6fr (line: 426)
  - .action-queue uses repeat(4, 1fr) (line: 599)
  - .action-slot min-height: 52px (line: 604)
  - mana-orb size: 10px (lines: 672-674)
  - battle-log max-height: 110px (line: 803)

- Animations and durations in CSS:
  - unit-shake animation length: 300ms (line: 321)
  - unit-damage-shake: 240ms (line: 346)
  - damage floating: translateY -50px over 1s (lines: 356-369)
  - psynergy-burst: 0.9s (line: 401)
  - damage-number font-size: 1.5rem / critical 2rem (lines: 363-375)

- Z-index layering (src/ui/components/QueueBattleView.tsx):
  - Z_INDEX.BATTLE_LOG = 45 (line: 43) and other Z_INDEX values (lines: 39-49)

- In-code sprite sizes (src/ui/components/BattleUnitSprite.tsx):
  - SIZE_MAP small=32×32, medium=48×48, large=64×64 (lines: 32-36, 57-73)

These values are scattered in CSS and some are duplicated in JS/TS (sprite sizes). Centralize them.

---

## 2) Unit positioning and sizing (current behaviour)
- Visual layout is grid-based rather than pixel absolute positioning; battlefield uses columns (.battlefield-column) to place enemy and player columns (lines: 272-277).
- Unit visual tile sizes:
  - Sprite assets drawn at sizes in BattleUnitSprite (32/48/64). CSS battlefield-unit uses 48px squares (48 matches medium size).
  - Unit card sprite box uses 36px; small mismatch vs SIZE_MAP small/medium — surface inconsistency to resolve.
- Floating numbers, FX, and psynergy GIFs are positioned absolutely within the battlefield container and use CSS animations (damage-number, psynergy-effect).

Recommendation: unify sprite base-size constant so CSS (.battlefield-unit, .unit-sprite) and TSX (SIZE_MAP) reference the same constants.

---

## 3) Current battle state schema (single source of truth)
There are two complementary representations in the repo:

A) Lightweight UI store representation (legacy / gameStore) — src/store/gameStore.ts
- BattleSlice.BattleSession (line: 52) with shape:
  - battle: BattleState (lightweight in that file)
  - rngSeed: number
  - turnNumber: number
  - eventQueue: BattleEvent[]
  - rewards: BattleRewards | null
- UI-facing BattleState in that file has keys: enemyId, phase (line: 28-31) — legacy simplified view

B) Core canonical BattleState — src/core/models/BattleState.ts (the authoritative model)
- BattleState extends: BattleTurnOrder, BattleQueue, BattleProgress, BattleMetadata (line: 126)
- Key fields:
  - playerTeam: Team (line: 128)
  - enemies: Unit[] (line: 131)
  - unitById: ReadonlyMap<string, UnitIndex> (line: 137)
  - log: readonly string[] (line: 139)
  - remainingMana, maxMana (lines: 143-146)
  - queuedActions: readonly (QueuedAction | null)[] (line: 69)
  - phase: 'planning'|'executing'|'victory'|'defeat' (line: 25, 82)
  - roundNumber/currentTurn (lines: 86-89)
  - djinnRecoveryTimers (line: 149)

C) UI slices tied to the core model
- src/ui/state/queueBattleSlice.ts defines QueueBattleSlice with UI-tracking fields (battle, events, rngSeed, activePortraitIndex, currentMana, pendingManaThisRound, pendingManaNextRound, critCounters, etc.) (lines: 66-81)
- src/ui/state/battleSlice.ts is also present, handling performAction / endTurn flows and bridging core services to UI.

Decision point: Core BattleState (src/core/models/BattleState.ts) must remain canonical; UI slices should adapt/derive from it rather than duplicate fields. This doc references core model fields and UI slice fields that must be kept in sync.

---

## 4) Animation & transition logic to preserve
- QueueBattleView derives UI phase based on events array: uiPhase = events.length > 0 ? 'executing' : deriveUIPhase(battle?.phase) (src/ui/components/QueueBattleView.tsx lines ~415). This behavior is relied upon throughout the view (execution gating, event processing). DO NOT change semantics without migrating callers.
- FX mapping (ABILITY_FX_MAP) maps ability IDs → GIF paths (QueueBattleView.tsx lines ~75-129). This is an explicit mapping the UI expects; if GIFs are generalized, preserve mapping fallback semantics (ability→element fallback→global fallback).
- Z-index layering is explicitly set in QueueBattleView (Z_INDEX object) and referenced by components; preserve numeric ordering even if moving values to constants.
- Crit flash logic: queueBattleSlice maintains critFlash timeouts and triggerCritFlash sets a 200ms timeout (lines ~189-206). Keep the timeout behavior or make it configurable.
- Game-level transitions (startTransition in gameStore) use a two-stage 150ms wait to change screen and fade back (lines 186-209). Preserve the small delay semantics when migrating transitions to a centralized animation system.
- CSS animation durations noted above (unit-shake 300ms, damage-float 1s, psynergy-burst 0.9s) are referenced by UI timing logic (getEventTiming) and useBattleSpeed hook; preserve relative timing relationships when centralizing.

---

## 5) Exact hardcoded items (actionable list to centralize)
Extracted constants that should be moved to a constants file or CSS custom properties:
- Screen base: WIDTH = 1280, HEIGHT = 720, PADDING_X = 12, PADDING_Y = 8, GAP = 4
- Rows: TOP_HUD_HEIGHT = 80, TOP_ROW_HEIGHT = 220, BOTTOM_ROW_HEIGHT = 210
- Turn-order icon: TURN_ORDER_UNIT_SIZE = 40
- Unit card sprite: UNIT_CARD_SPRITE_SIZE = 36
- Battlefield unit visual: BATTLE_UNIT_SIZE = 48
- Sprite size map: SPRITE_SIZE_SMALL = 32, MEDIUM = 48, LARGE = 64 (BattleUnitSprite)
- Action queue slots: ACTION_SLOT_MIN_HEIGHT = 52 and ACTION_QUEUE_COLUMNS = 4
- Mana orb size: 10px
- CSS animation durations: UNIT_SHAKE_MS = 300, UNIT_DAMAGE_SHAKE_MS = 240, DAMAGE_FLOAT_MS = 1000, PSYNERGY_BURST_MS = 900
- Z_INDEX mapping: keep individual names (BACKGROUND, SPRITES, HUD, BATTLE_LOG=45, BOTTOM_BAR=50, etc.)
- battle-log max-height = 110
- BATTLE_LOG (TS constant) = 45 (QueueBattleView Z_INDEX)

---

## 6) Recommendations and next steps (minimal, surgical)
1. Create src/ui/constants/battleLayout.ts (or similar) to export the numeric constants above and replace scattered literals (CSS may consume CSS variables generated from these constants or keep CSS values and update TS to import sizes from a single file).
2. Add CSS custom properties in :root for units/sizes and grid rows (e.g. --battle-width, --turn-unit-size, --battle-unit-size) and refactor battle-screen.css to reference them; update BattleUnitSprite.SIZE_MAP to import the same numbers (or generate a small mapping module).
3. Keep core/models/BattleState.ts as the canonical schema. Update any lightweight duplicates to derive or reference it (store/gameStore.ts BattleSession should store core BattleState as-is). Deprecate the simplified fields in store/gameStore.ts in favor of derived selectors.
4. Preserve animation timing semantics: centralize animation durations in src/ui/constants/animationTiming.ts (existing file) and ensure CSS values match it (or vice-versa). Keep QueueBattleView event→phase derivation intact.

---

## 7) Notes on non-obvious decisions (for reviewers)
- Multiple size inconsistencies exist (unit-card sprite 36px vs SIZE_MAP small=32, battlefield unit 48 vs unit-sprite 36). The recommended resolution is to treat 48px as canonical battle display unit and map other small sizes with explicit scale factors rather than ad-hoc numbers.
- The UI contains legacy "V1" store shapes and newer queue-based QueueBattleSlice; treat src/core/models/BattleState.ts as the canonical authoritative model and migrate UI slices to map onto it gradually.
- FX mapping is intentionally explicit (ABILITY_FX_MAP). If converting to data-driven FX, keep the same fallback chain (direct map → element-based → global fallback).

---

## 8) Quick search targets (where to edit first)
- src/ui/styles/battle-screen.css (centralize CSS numbers)
- src/ui/components/BattleUnitSprite.tsx (SIZE_MAP) - unify with CSS
- src/ui/components/QueueBattleView.tsx (Z_INDEX, BATTLE_LOG value, FX mapping)
- src/ui/state/queueBattleSlice.ts (local UI fields: currentMana, pendingMana, critFlash timeouts)
- src/core/models/BattleState.ts (schema / canonical fields)

---

## 9) Inline TSX hardcoded values discovered (actionable)
The repo contains several inline style literals and template calc expressions that are not in CSS files. These should be collected into the constants module when centralizing:

- src/ui/components/QueueBattleView.tsx
  - height: '280px' (component root)
  - gridTemplateColumns: '260px 1fr' (layout column split)
  - perspective: '1000px'
  - bottom: '30px' (several elements)
  - bottom: `calc(100% + ${idx * 16 + 6}px)` — tooltip offset computed from idx where 16 and 6 are magic numbers determining vertical stacking offset
  - boxShadow / border widths using raw px values (e.g., borderLeft: '4px solid #ffd700')
  - grid columns / widths (e.g., 260px, 280px) used for side panels

- src/ui/components/QueueBattleView.tsx and other components:
  - many inline paddings/margins using px (8px, 10px, 12px, 14px) — prefer spacing system variables (--spacing-sm/md/lg)
  - text-shadow and drop-shadow values (e.g., '0 0 12px') are repeated; consider design tokens

- src/ui/components/BattleActionMenu.tsx
  - padding values: '4px 12px', borders '2px' etc.

- Any inline style that uses `${idx * 16 + 6}` or other small arithmetic should be replaced with a named constant (TOOLTIP_STACK_GAP = 16, TOOLTIP_STACK_BASE = 6)

Recommendation: create src/ui/constants/battleLayout.ts and src/ui/constants/uiSpacing.ts to host these numbers and export both numeric values for TSX and generate matching CSS custom properties where practical.

---

## 10) Worker handoff / missing artefacts
- Checked for "watcher_prep" referenced in the handoff; no file, function, or identifier named watcher_prep was found in the repository search. If worker A expected a watcher_prep patch, request the location or provide the missing artifact.

---

## Appendices
- Exact occurrences of a few critical magic numbers:
  - 1280×720 (.battle-screen)
  - grid rows: 80px, 220px, 1fr, 210px
  - turn-order icons: 40px
  - unit-sprite: 36px
  - battlefield-unit: 48px
  - SIZE_MAP: small=32, medium=48, large=64
  - Z_INDEX.BATTLE_LOG = 45
  - action-queue repeat(4, 1fr) and action-slot min-height 52
  - CSS animation durations: 300ms, 240ms, 1s, 0.9s

If anything above should be split into multiple documents (layout vs state vs animations), propose splitting but keep this file as the single index and source-of-truth pointer.

---

Document created by automated repository inspection. If anything missing or if other files should be included, update this document before performing refactors. 
