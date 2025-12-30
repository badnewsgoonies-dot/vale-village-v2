Battle Screen — Current State

Summary

This document captures the current code, assets, tests, and mockups related to the battle screen UI to give future workers a single place to start.

Located source files (key):

- src/ui/components/battle/LayoutBattle.tsx — Primary React component for the battle screen layout and composition.
- src/ui/components/battle/types.ts — Types used by battle components (data contracts / props).
- src/ui/styles/battle-screen.css — Styles scoped for the battle screen.
- src/ui/state/battleSlice.ts — Redux slice (or similar state slice) managing battle runtime state.
- src/ui/state/battleConfig.ts — Configuration and constants for battle behavior.
- src/ui/sprites/mappings/battleSprites.ts — Sprite mappings used by the battle UI.
- src/core/validation/battleStateInvariants.ts — Runtime validation helpers and invariants for battle state.

Related tests and scripts

- tests/e2e/battle-animations.spec.ts — E2E tests exercising battle animations.
- tests/unit/validation/battleStateInvariants.test.ts — Unit tests for state invariants.
- scripts/*battle*.ts (multiple) — Utility scripts for running, capturing, or simulating battles (tower-battle-test, tower-full-battle, capture-battle-ui, etc.).

Mockups and coverage

- mockups/battle/* — Static HTML mockups (index.html, target-selection.html, queue-based.html) that show intended UI flows and interactions.
- coverage/.../LayoutBattle.tsx.html — Instrumentation/coverage output references LayoutBattle (useful for understanding exercised codepaths).

Gaps, notes, and observations

- There is no single high-level documentation page describing the battle screen architecture; this file aims to be that starting point.
- LayoutBattle appears to assemble pieces; deeper componentization (e.g., separate panels for UI, queue, target selection, HUD) should be verified in the component tree.
- battleSlice + battleStateInvariants suggest there are strict runtime invariants; any changes to UI must respect those invariants to avoid desync.
- Styles are in a single CSS file; consider migrating to modular/scoped styles if multiple battle variants are needed.

Design/engineering recommendations

- Owner or next worker should open LayoutBattle.tsx and enumerates child components and props to produce a component map (component responsibilities and data flows).
- Add a short diagram (ASCII or image) mapping state sources (battleSlice, config, sprites) to UI consumers to reduce onboarding time.
- Add a dedicated tests/README for running and extending the battle-related tests and scripts, including the `capture-battle-ui` and `tower-battle-screenshot` scripts.

Decision for this document

- Placed under docs/compendium to keep UI/system compendia in one directory and avoid duplicating top-level docs.

Next actions (recommended)

1. Create a component map by inspecting LayoutBattle.tsx and its imports and add it to this document (component responsibilities + props).
2. Run the E2E animation test locally and capture a short checklist of failing/flaky steps (if any).
3. Consider splitting battle-screen.css into modular files if multiple battle screen variants are introduced.

Verification results

- src/ui/components/battle/LayoutBattle.tsx — present
- src/ui/components/battle/types.ts — present
- src/ui/styles/battle-screen.css — present
- src/ui/state/battleSlice.ts — present
- src/ui/state/battleConfig.ts — present
- src/ui/sprites/mappings/battleSprites.ts — present
- src/core/validation/battleStateInvariants.ts — present
- tests/e2e/battle-animations.spec.ts — present
- tests/unit/validation/battleStateInvariants.test.ts — present
- mockups/battle/* — present (index.html, target-selection.html, queue-based.html)
- scripts/*battle*.ts — present (tower-battle-test, capture-battle-ui, tower-battle-screenshot, etc.)

Notes

- "watcher_prep" was referenced in the handoff instruction but no file or symbol by that name was found in the repository; if it refers to a script or helper, please provide the path or intended name.
- All referenced key source files were verified to exist at the paths listed above; the document has been annotated with these verification results to aid onboarding.

Contact / Handoff notes

- Non-obvious decision: document placed in docs/compendium to follow existing UI documentation conventions (see docs/compendium/ui-sitemap.md).
- No code changes were made; this is an investigative document to reduce duplication of search work for future contributors.

