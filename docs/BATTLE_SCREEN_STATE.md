BATTLE SCREEN STATE

Overview
- Purpose: Describe the current runtime and UX state of the battle screen, the authoritative source files, UI components, state model, and outstanding gaps developers should know when modifying battle behavior or UI.
- Scope: Surface-level design + engineering map (not implementation details). Treat this file as the single-source-of-truth for battle-screen state documentation.

Authoritative source files and locations
- Core models and state:
  - src/core/models/BattleState.ts (Battle domain model, canonical state shape)
  - src/data/schemas/BattleStateSchema.ts (persisted/validation schema used by save & replay)
  - src/ui/state/battleSlice.ts (UI-facing redux slice for live battle state)
  - src/ui/state/queueBattleSlice.ts (queue-based battle flow state)
  - src/ui/state/battleConfig.ts (battle configuration values)
  - src/ui/types/BattleUIPhase.ts (enumeration of UI phases)
- Services and logic:
  - src/core/services/BattleService.ts (primary battle engine operations)
  - src/core/services/QueueBattleService.ts (queue-based runtime flow)
  - src/core/services/BattleTransaction.ts (transactional operations applied to battle state)
  - src/core/services/AIService.ts (enemy decision-making)
- UI components (rendering and composition):
  - src/ui/components/battle/LayoutBattle.tsx (top-level battle layout)
  - src/ui/components/battle/BattleOverlay.tsx (overlays for victory/defeat/dialogue)
  - src/ui/components/battle/Battlefield.tsx (main battle arena & unit positioning)
  - src/ui/components/battle/QueuePanel.tsx (action queue display)
  - src/ui/components/battle/AbilityPanel.tsx (player ability selection)
  - src/ui/components/battle/TurnOrderStrip.tsx (turn order UI)
  - src/ui/components/battle/SidePanelPlayer.tsx and SidePanelEnemy.tsx
  - src/ui/components/battle/CommandPanel.tsx and BattleActionMenu.tsx
  - other supporting UI: UnitCard, BattleUnitSprite, BattleManaBar, DjinnPanel, BattleLog, VictoryOverlay, DefeatOverlay
- Coverage / references: Coverage HTML files include rendered sources and are useful for quick discovery (coverage/vale-village-v2/src/ui/components/battle/*.html)
- Mockups and prototypes: mockups/battle/*.html (target selection, queue-based flows, visual references)

Runtime state model (high level)
- BattleState (domain) contains immutable-like snapshots driven by BattleService and transformed by BattleTransaction; persisted with BattleStateSchema for replays/saves.
- UI state slices (battleSlice, queueBattleSlice) mirror domain state for rendering and store transient UI-only flags (selectedUnitId, highlightedTargets, inputMode).
- BattleUIPhase controls high-level flow (examples: Idle, SelectingTarget, Animating, ShowingResults). Components should react to phase changes instead of reading many disparate flags.

Events & actions (how UI and engine communicate)
- Engine -> UI: emits state updates, queued action results, and animation triggers via service responses and dispatches to the redux slices.
- UI -> Engine: dispatches intent actions (select ability, target, confirm action, change speed, pause) which are validated and then applied via BattleTransaction/BattleService.
- AI decisions are scheduled through AIService and integrated into the queue/service so playback consistency is maintained.

Important invariants and engineering notes
- No magic numbers: configuration values driven from battleConfig and constants in src/core/constants.ts (prefer adding named constants rather than inline numbers).
- Single source of truth: BattleState (core model) is authoritative; UI slices are projections for rendering and should not be treated as canonical for game rules.
- Determinism & replays: use BattleStateSchema and ReplayService for capture/replay; do not introduce RNG into UI-only flows that would diverge replays.

Current gaps & recommended documentation actions
- There is no dedicated docs/BATTLE_SCREEN_STATE.md before this file; mockups exist but a textual engineer-facing state map was missing — this file fills that gap.
- Suggested additions (next steps):
  1) Add a short sequence diagram that shows the flow: User action -> dispatch -> BattleService -> BattleTransaction -> update -> UI render.
  2) Document BattleUIPhase enum values and intended transitions in more detail (current code enumerations are the source of truth; documenting transitions reduces regressions).
  3) Add explicit list of UI-visible constants (panel sizes, animation timeouts) and relocate magic numbers into named constants if found in components.

Non-obvious decisions and rationale
- Decision: favor documenting domain model files first (BattleState.ts, BattleStateSchema) because bugs in game rules stem from model mismatches rather than rendering.
- Rationale: keeping the canonical model as the single source reduces accidental rule changes when refactoring UI components.

Where to look when changing battle behavior
- Start at src/core/models/BattleState.ts and src/core/services/BattleService.ts for rule changes.
- Mirror any shape changes into the BattleStateSchema and update queueBattleSlice/battleSlice projections.
- Update mockups in mockups/battle/ to keep visual references in sync.

Quick checklist for making UI changes safely
- Add/modify domain model -> update schema -> update services -> update slices -> update components -> add/adjust mockup -> run replay to verify determinism.

Contacts & references
- Mockups: mockups/battle/*.html
- Replay, save, and schema: src/data/schemas/*
- Coverage rendered sources: coverage/vale-village-v2/src/ui/components/battle/*.html

Revision notes
- This file was created to centralize battle screen state knowledge; keep it updated when making structural changes to state, phases, or services.

Detailed UI phases and transitions
- BattleUIPhase values: 'idle', 'planning', 'executing', 'victory', 'defeat'
- Valid transitions (from -> to):
  * idle -> planning
  * planning -> executing
  * executing -> planning, victory, defeat
  * victory -> idle
  * defeat -> idle
- Enforcement: use isValidTransition/assertValidTransition in src/ui/types/BattleUIPhase.ts to validate runtime transitions.

Sequence diagram (engineered flow)
- User -> UI: user action (select ability/target) -> dispatch intent action
- UI -> Engine: BattleService receives intent -> BattleTransaction applies rules -> returns result snapshot
- Engine -> UI: redux slices updated -> components read projection and render animations
- Post-animation: transition phase via assertValidTransition and proceed to next planning/executing cycle

Explicit constants to extract (recommended)
- Animation timeouts (ms) used across components -> consolidate into src/ui/constants/animation.ts
- Panel sizes and breakpoints -> src/ui/constants/layout.ts
- Input debounce/safety intervals -> src/ui/constants/timing.ts

Commit / handoff notes
- Decision: document phases and transitions verbatim to reduce ambiguity for next engineers.
- Rationale: small, exact additions minimize chance of drift between code and docs; prefer code-of-record in src/ for authoritative logic.
- When making further changes, update this doc immediately and reference the changed source file paths.


