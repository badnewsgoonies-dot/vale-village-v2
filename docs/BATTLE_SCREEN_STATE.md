# Battle Screen — Current State (summary)

This document captures the current state of the battle screen implementation as discovered in the codebase. It is intended as an index and short reference for engineers who will make design, refactor, or feature changes.

## High-level components

- LayoutBattle (src/ui/components/battle/LayoutBattle.tsx): top-level layout and composition of the battle UI.
- Battlefield (src/ui/components/battle/Battlefield.tsx): renders the battlefield grid and unit placements.
- BattleOverlay (src/ui/components/battle/BattleOverlay.tsx): overlays such as turn indicators, status effects, and contextual overlays.
- QueuePanel / ActionQueuePanel (src/ui/components/battle/QueuePanel.tsx, src/ui/components/ActionQueuePanel.tsx): visualises upcoming actions/turn order.
- BattleActionMenu, ActionBar (src/ui/components/BattleActionMenu.tsx, src/ui/components/ActionBar.tsx): player input and action selection UI.
- BattleUnitSprite, BattlePortraitRow, BattleManaBar (src/ui/components/*): visual widgets for units and HUD elements.
- BattleLog (src/ui/components/BattleLog.tsx): chronological combat event logging for debugging and player feedback.
- QueueBattleView / QueueBattleView.tsx (src/ui/components/QueueBattleView.tsx): alternative/entry views used by queued battles and developer harnesses.

## Key source files (quick reference)

- UI / components:
  - src/ui/components/battle/LayoutBattle.tsx
  - src/ui/components/battle/Battlefield.tsx
  - src/ui/components/battle/BattleOverlay.tsx
  - src/ui/components/battle/QueuePanel.tsx
  - src/ui/components/BattleActionMenu.tsx
  - src/ui/components/BattleLog.tsx
  - src/ui/components/BattleUnitSprite.tsx

- State & types:
  - src/ui/state/battleSlice.ts
  - src/ui/state/battleConfig.ts
  - src/ui/types/BattleUIPhase.ts
  - src/data/schemas/BattleStateSchema.ts
  - src/core/models/BattleState.ts

- Core services & logic:
  - src/core/services/BattleService.ts
  - src/core/services/QueueBattleService.ts
  - src/core/services/BattleTransaction.ts
  - src/core/services/AIService.ts
  - src/core/algorithms/damage.ts, healing.ts, djinn.ts, rewards.ts

- Assets & styling:
  - src/ui/sprites/mappings/battleSprites.ts
  - src/ui/sprites/manifest.ts
  - src/ui/styles/battle-screen.css

- Validation & constants:
  - src/core/constants.ts
  - src/core/validation/battleStateInvariants.ts

- Developer scripts & tools (useful for visual tests):
  - scripts/capture-battle-ui.ts
  - scripts/tower-battle-screenshot.ts
  - mockups/battle/* (static HTML previews)

## Tests & e2e coverage

- Unit tests referencing battle logic and invariants: tests/unit/core/algorithms/damage.test.ts, tests/unit/core/services/BattleService.test.ts, tests/unit/validation/battleStateInvariants.test.ts
- End-to-end / visual tests: tests/e2e/enemy-animations.spec.ts, tests/e2e/visual-verify.spec.ts, tests/e2e/battle-animations.spec.ts
- Screenshot / harness scripts exist to capture UI states (see scripts/ and mockups/)

## Observations & notes

- There is no single `BattleScreen.tsx` entry file; the UI is composed from a small set of layout + subcomponents. This is an intentional composition pattern but should be surfaced in documentation and diagrams so new contributors can find mount points quickly.
- Clear separation exists between presentation (ui/components) and game-rule orchestration (core/services). Maintain this boundary when refactoring: adapters are preferable to mixing core logic into UI components.
- Battle state shape is validated by schemas and invariant checks (BattleStateSchema, battleStateInvariants). Any state-shape changes must update those schemas and corresponding tests.
- Several visual and e2e tests exercise battle flows; update or extend them if UI changes alter render order/timing.
- watcher_prep: no dedicated "watcher_prep" artifact or script was found in the repository root. Developers typically rely on existing scripts (capture-battle-ui, mockups, and the QueueBattleView harness). If a dedicated watcher or dev harness is required for iterative visual testing, add a short script under scripts/ (no magic numbers; expose constants) and document it here.

## Recommended next actions (concrete)

1. Add a sequence diagram (UI -> BattleService -> BattleTransaction -> battleSlice) and attach it to this doc or docs/diagrams/ for quick onboarding.
2. Create a small integration test that mounts LayoutBattle and simulates a minimal transaction via a mocked BattleService to verify battleSlice updates and UI hooks (use existing unit-test patterns).
3. If iterative visual development is desired, add a watcher script (scripts/watch-battle-ui.ts) that launches a minimal harness (QueueBattleView) and exposes constants for screenshots; document it in this file.

## Handoff notes (developer decisions / constraints)

- Do not change core BattleService semantics in-place; use an adapter or facade to allow UI refactors without breaking game-rule guarantees.
- Extract numeric thresholds and timings to src/core/constants.ts (avoid magic numbers) before changing behavior.
- Preserve validation hooks in src/core/validation; update tests when the shape changes.
- Document any non-obvious decisions here so the next worker can understand trade-offs.

---

(Generated on 2025-12-30)
