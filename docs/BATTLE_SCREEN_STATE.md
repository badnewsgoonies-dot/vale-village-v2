BATTLE SCREEN - SINGLE SOURCE OF TRUTH

Overview

This document collects the authoritative UI layout numbers, unit sizing, and battle-related state schema found in the codebase so they can be centralized and rationalized.
Files referenced
- src/ui/styles/battle-screen.css
- src/ui/components/battle/LayoutBattle.tsx
- src/ui/components/battle/Battlefield.tsx
- src/ui/components/BattleUnitSprite.tsx
- src/ui/components/battle/types.ts
- src/ui/state/battleSlice.ts
- src/ui/state/battleConfig.ts
- src/ui/constants/animationTiming.ts

1) Screen dimensions and grid / layout magic numbers
- .game-root: width: 100vw; height: 100vh (responsive root)
- .battle-screen: width: 1280px; height: 720px; max-width:100vw; max-height:100vh; padding: 8px 12px; gap: 4px;
- Grid rows on .battle-screen: grid-template-rows: 80px 220px 1fr 210px;
  - Top row (turn order): 80px
  - Second row (top-row player/enemy lists): 220px
  - Middle row (battlefield + phase indicator): flexible 1fr
  - Bottom row (command / queue / right panel): 210px
- .top-row columns: grid-template-columns: 1.1fr 0.9fr (proportional split)
- .bottom-row columns: grid-template-columns: 0.8fr 1.1fr 0.6fr

Notes / concerns
- The 1280x720 fixed design is a design decision; it should be promoted to a named constant (e.g. BATTLE_CANVAS_WIDTH, BATTLE_CANVAS_HEIGHT) and exposed as CSS variables for easy scaling.
- The explicit row heights (80, 220, 210) are layout-specific "designer" values and should be centralized.

2) Unit positioning and sizing (hardcoded pixels found)
- Turn order unit: 40 x 40 (CSS .turn-order-unit)
- Unit card sprite: .unit-sprite width: 36px x 36px
- Unit card grid columns: grid-template-columns: 40px 1fr (40px is sprite column width)
- Battlefield unit tile: .battlefield-unit width: 48px x 48px (also used by BattleUnitSprite default medium size)
- CSS .battlefield-inner padding: 12px; gap between columns: 6px
- HP bar height: 6px; hp-fill default width hardcoded at 70% in sample (.hp-fill)
- Action slot min-height: 52px
- Mana orb: 10px diameter
- Damage floating translation: -50px (damage-float animation)
- Animation durations in CSS: unit-shake 300ms, unit-damage-shake 240ms, damage-float 1s, psynergy-burst 0.9s
- In-component sizing map: src/ui/components/BattleUnitSprite.tsx SIZE_MAP: small=32x32, medium=48x48, large=64x64

Recommendation
- Introduce a central numeric constants file for UI (e.g., src/ui/constants/layout.ts) containing: canvas width/height, row heights, sprite sizes, spacing tokens, and action-slot heights. Replace CSS raw values with CSS variables (--battle-canvas-width) and keep TypeScript SIZE_MAP derived from the same constants.

3) Battle state schema and properties (single authoritative list)
From src/ui/state/battleSlice.ts and src/ui/components/battle/types.ts the primary UI-facing state and APIs are:

BattleSlice (zustand slice) exported members
- state properties:
  - battle: BattleState | null
  - events: BattleEvent[]
  - rngSeed: number (default 1337 in slice)
  - turnNumber: number
- actions / APIs:
  - setBattle(battle, seed)
  - startTurnTick()
  - perform(casterId, abilityId, targetIds)
  - endTurn()
  - dequeueEvent()
  - performAIAction()
  - preview(casterId, abilityId, targets) -> { avg, min, max }

UI view models (from types.ts)
- UnitVM: { id, name, element, hp?, maxHp?, statuses, isSelected, isKo, isEnemy }
- TurnOrderUnitVM: { id, name, side, isCurrent }
- AbilityVM, DjinnVM, ActionSlotVM, ManaVM, BattleLogEntry, BattlePhase, BattleStatus, BattleRewardsVM
- Component props like BattlefieldProps: { playerUnits, enemyUnits, targetingMode, onSelectTarget }

Notes / magic numbers in state code
- battleSlice: default rngSeed = 1337 (magic seed)
- preview: sample count N = 16 (magic sampling count) and previewSeed computed using bit shifts (turnNumber << 8, abilityId.length << 16, casterId.length << 24). These bit offsets and the N sample size should be named constants and documented (e.g., PREVIEW_SAMPLE_COUNT, PREVIEW_SEED_SHIFTS).
- performAIAction fallback RNG uses rngSeed + turnNumber * 1_000_000 (magic multiplier). Replace with a named constant or a function createRngForStage(rngSeed, turnNumber, streamId).

4) Animation / transition logic to preserve or move
- Explicit timing constants are centralized in src/ui/constants/animationTiming.ts (ANIMATION_TIMING, getEventTiming, SPEED_PRESETS). Preserve this file and use it as canonical timing source in animations and services.
- CSS-based animations (unit-shake, unit-damage-shake, damage-float, psynergy-burst) are currently defined in CSS and rely on durations; keep these but reference timing constants where possible.
- The sequencing of action → impact → inter-event is implemented in getEventTiming and used by the battle services; this logic must be preserved when refactoring CSS durations to variables.

5) Places where logic and styling cross (candidates for refactor)
- BattleUnitSprite has a local SIZE_MAP and Battle CSS has .battlefield-unit and .unit-sprite sizes; these must be unified.
- battle-screen CSS contains many hardcoded numbers that are also implicitly used by layout components (grid-template-rows heights, paddings, gaps). These should be converted to CSS variables whose values are derived from the canonical TS constants at build/runtime or kept in a single CSS file of tokens.
- RNG and preview constants live in the slice file and should be promoted to src/core/constants or src/ui/constants with clear names and explanation.

6) Immediate actionable recommendations (next steps)
- Create src/ui/constants/layout.ts and move the following into named exports: BATTLE_CANVAS_WIDTH=1280, BATTLE_CANVAS_HEIGHT=720, ROW_HEIGHT_TURN_ORDER=80, ROW_HEIGHT_TOP=220, ROW_HEIGHT_BOTTOM=210, DEFAULT_SPRITE_SMALL=32, DEFAULT_SPRITE_MEDIUM=48, DEFAULT_SPRITE_LARGE=64, etc.
- Replace hardcoded numeric CSS values with CSS variables and wire them from a small build step or keep them and align TS constants to match.
- Centralize RNG preview constants: PREVIEW_SAMPLE_COUNT = 16, PREVIEW_SEED_SHIFT_1 = 8, etc. Replace inline literals in src/ui/state/battleSlice.ts.
- Document any designer decisions (1280x720 base) in this file and ask designers before changing them.

7) Non-obvious decisions recorded
- The fixed 1280x720 canvas is intentional (mockup-accurate). It remains the baseline while max-width/max-height allow scaling; therefore refactors should aim for variable-driven scaling rather than removing the baseline.
- The ANIMATION_TIMING file is authoritative for sequencing; when extracting CSS durations to variables, keep values in sync with ANIMATION_TIMING.

References and next worker checklist
- Files to update first: src/ui/constants/layout.ts (new), replace literals in src/ui/styles/battle-screen.css with CSS vars, update BattleUnitSprite.SIZE_MAP to read from layout constants, update battleSlice to use named RNG/preview constants.
- High-priority files to inspect for additional magic numbers: src/ui/components/QueueBattleView.tsx (inline px & animation delays), src/core/models/BattleState.ts (canonical schema), src/core/services/QueueBattleService.ts (execution rules & timing interplay with ANIMATION_TIMING).

Appendix - raw magic numbers found (quick scan) (expanded)
- Layout (src/ui/styles/battle-screen.css):
  - Canvas baseline: 1280 × 720 (width: 1280px; height: 720px)
  - Grid rows: 80px (turn order), 220px (top lists), 1fr (battlefield), 210px (bottom panels)
  - Padding/gap: padding: 8px 12px; gap: 4px
- Turn / portrait / unit card sizes (src/ui/styles/battle-screen.css, src/ui/components/*):
  - Turn order unit: 40 × 40 (.turn-order-unit)
  - Unit card sprite: 36 × 36 (.unit-sprite)
  - Unit card grid sprite column: 40px (grid-template-columns: 40px 1fr)
  - Battlefield tile/unit: 48 × 48 (.battlefield-unit)
  - Status icon: 14 × 14 (.status-icon)
  - HP bar: height: 6px (.hp-bar), sample hp-fill width default: 70% (.hp-fill)
- Bottom / queue / panels (src/ui/styles/battle-screen.css, src/ui/components/QueueBattleView.tsx):
  - Queue panel height: 280px (QueueBattleView inline style)
  - Queue left column width: 260px (gridTemplateColumns: '260px 1fr')
  - Action-slot min-height: 52px (.action-slot)
  - Mana orb: 10px diameter (.mana-orb)
  - Popover base bottom offset: ~30px; dynamic popover offset computed as `calc(100% + ${idx * 16 + 6}px)` in QueueBattleView (src/ui/components/QueueBattleView.tsx)
- Spacing tokens already present (src/ui/styles/spacing-system.css): many tokens exist (4px, 8px, 16px, 24px, 32px, 48px, 64px) — recommend reusing these instead of ad-hoc literals inside battle CSS/JS
- Sprite size map (src/ui/components/BattleUnitSprite.tsx): small=32, medium=48, large=64 (SIZE_MAP). These should be derived from canonical layout constants.
- Animation / timing (src/ui/constants/animationTiming.ts and src/ui/styles/battle-screen.css):
  - CSS animations: unit-shake 300ms, unit-damage-shake 240ms, damage-float 1s, psynergy-burst 0.9s
  - Timing file ANIMATION_TIMING is authoritative for sequencing (WINDUP, EXECUTE, IMPACT, INTER_EVENT, MIN_DISPLAY)
  - Recommendation: map CSS durations to CSS variables driven by the ANIMATION_TIMING values to avoid drift
- JS RNG / preview / stream constants (src/ui/state/battleSlice.ts, src/ui/state/queueBattleSlice.ts):
  - Default RNG seed in slices: 1337 (rngSeed: 1337)
  - Preview sampling: N = 16 (preview sample count)
  - Preview seed construction uses bit shifts: (turnNumber << 8), (abilityId.length << 16), (casterId.length << 24)
  - AI end-turn fallback uses expression: rngSeed + turnNumber * 1_000_000 (magic multiplier)
  - Queue and slice APIs call createRNGStream(...) with named RNG_STREAMS for per-stage determinism
- Inconsistent seed initialization locations to resolve:
  - src/ui/state/battleSlice.ts (defaults to 1337)
  - src/ui/state/queueBattleSlice.ts (defaults to 1337)
  - src/store/gameStore.ts startBattle uses: const seed = rngSeed ?? Date.now(); (different default behaviour)
  - Recommendation: choose a single seed-init policy (design decision: tests may rely on 1337; runtime starts should be Date.now when not provided). Centralize in src/core/constants or src/core/rng-init.ts
- Inline JS layout numbers found (candidates to extract):
  - QueueBattleView.tsx: height '280px', gridTemplateColumns '260px 1fr', perspective '1000px', bottom: '30px', popover calc with idx * 16 + 6
  - Many components use inline padding/margins (e.g., padding: '6px 12px') — migrate to tokens
- Files to update to centralize constants (minimal starting set):
  - Add: src/ui/constants/layout.ts (BATTLE_CANVAS_WIDTH = 1280, BATTLE_CANVAS_HEIGHT = 720, ROW_HEIGHT_TURN_ORDER = 80, ROW_HEIGHT_TOP = 220, ROW_HEIGHT_BOTTOM = 210, PADDING_X = 12, PADDING_Y = 8, GAP = 4, SPRITE_SMALL = 32, SPRITE_MEDIUM = 48, SPRITE_LARGE = 64, TURN_ORDER_UNIT = 40, HP_BAR_HEIGHT = 6, ACTION_SLOT_MIN_HEIGHT = 52, MANA_ORB = 10)
  - Add/align: src/ui/constants/timing.ts (re-export ANIMATION_TIMING) if needed
  - Add/align: src/ui/constants/rng.ts (PREVIEW_SAMPLE_COUNT = 16, PREVIEW_SEED_SHIFT_* constants, RNG_STREAM_BASE_MULTIPLIER = 1_000_000)
- Preservation notes (animation / sequencing / state):
  - Keep getEventTiming and ANIMATION_TIMING as the sequencing source; when mapping to CSS variables, ensure numeric ms values are preserved exactly
  - Preview() must remain deterministic and non-destructive to live RNG; keep clone/preview PRNG behavior
  - Battle event sequencing relies on RNG streams (RNG_STREAMS) — do not change stream ordering or numeric stream constants without tests
- Shortlist of remaining hardcoded locations to audit next (quick grep results):
  - src/ui/components/QueueBattleView.tsx (many inline px values and dynamic offsets)
  - src/ui/styles/battle-screen.css (primary layout values)
  - src/ui/components/BattleUnitSprite.tsx (SIZE_MAP)
  - src/ui/state/battleSlice.ts and src/ui/state/queueBattleSlice.ts (rng defaults, preview constants)
  - src/store/gameStore.ts (startBattle seed default differs)

If anything in this document conflicts with existing design notes or previous centralization (watcher_prep), extend the existing module instead of creating duplicates and record the rationale in commit/handoff notes.
