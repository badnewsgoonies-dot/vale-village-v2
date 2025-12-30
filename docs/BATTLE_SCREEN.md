# Battle Screen — Current State

Purpose
- Document the present implementation, assets, tests and known gaps for the battle screen so next work can be planned and executed without guesswork.

Key implementation files
- src/ui/components/battle/LayoutBattle.tsx — main React component for the battle screen layout and UI composition.
- src/ui/components/battle/types.ts — battle-related prop and type definitions.
- src/ui/styles/battle-screen.css — visual styling used by the LayoutBattle component.

State, config and validation
- src/ui/state/battleSlice.ts — Redux slice (or equivalent) that holds battle runtime state.
- src/ui/state/battleConfig.ts — battle configuration values and tuning parameters.
- src/core/validation/battleStateInvariants.ts — validators that assert invariants for battle state (covered by unit tests).

Assets and sprite mappings
- src/ui/sprites/mappings/battleSprites.ts — mapping of sprite assets used during battle.

Mockups, simulators and scripts
- mockups/battle/* — static mockups and target-selection/queue-based HTML prototypes for UI experimentation.
- scripts/battleSimulator.ts — simulation helper used by scripts/tests.
- scripts/tower-full-battle.ts, scripts/tower-battle-test.ts, scripts/tower-battle-screenshot.ts — tower battle scripts for automated scenarios and screenshots.

Tests
- tests/e2e/battle-animations.spec.ts — E2E tests around battle animations and interactions.
- tests/unit/validation/battleStateInvariants.test.ts — unit tests validating the invariant enforcement logic.

Observations & recommendations
- The codebase already separates UI, state and validation which is good for maintainability.
- Introduce a single source of constants (e.g., src/ui/state/battleConstants.ts) to avoid magic numbers in LayoutBattle, styles and logic; promote expressive constant names for durations, dimensions and numeric thresholds.
- Add a short README or KUSTOM doc (this file is the start) linking component props, state shape and lifecycle events so new contributors can reason about the battle flow quickly.
- Consider adding Storybook stories for LayoutBattle and visual regression tests for the core battle states (idle, targeting, resolve) to catch UI regressions early.
- If making changes that affect state invariants, update src/core/validation/battleStateInvariants.ts and corresponding unit tests to fix root-cause issues rather than masking them.

Handoff notes
- Start work by auditing LayoutBattle.tsx and identifying any inline numeric literals; extract them to battleConstants.ts and import where needed.
- Verify tests under tests/unit/validation and tests/e2e/battle-animations to ensure invariant expectations and animation timings are still valid after refactors.

Next actions (concrete)
1. Create src/ui/state/battleConstants.ts with well-named constants and replace magic numbers in LayoutBattle and battleConfig.
2. Add Storybook stories for LayoutBattle and unit-level visual snapshot tests.
3. Update/extend README with a battle screen sequence diagram showing event flow between UI, state and validation.

Notes
- No duplicate summary file was found prior to creating this document; this file is placed at docs/BATTLE_SCREEN.md.
- Non-obvious decision: chose docs/ for the summary (central place for human-facing documentation) rather than top-level repo because a docs/ directory already exists and is used in the project.

