Vale Village v2 - Autonomy Spec (Senior-Level, Minimal Prompt)

Purpose
Define the minimum spec kit and acceptance criteria for an autonomous agent to
recreate Vale Village v2 from docs with minimal prompts. This is a rebuild
target, not an improvement plan.

Target Skill Level
Senior dev who can recreate the project from docs with minimal prompts.

Non-Goals
- No feature expansion or design improvements unless explicitly directed.
- No architecture changes that deviate from documented behavior.
- No UI polish or balancing beyond what the docs specify.

Source of Truth (Docs)
- docs/v2-migration-guide.md
- docs/OVERWORLD_REBUILD_PLAN.md
- docs/BATTLE_SCREEN_STATE.md
- docs/MECHANICS_AUDIT.md
- docs/PROGRESSION_SCHEMA.md
- docs/PLAYTEST_STRATEGY.md

Spec Kit Checklist (Must Exist)
1) Vision + scope
   - One-page summary: what the game is, what "done" means, and what is out of scope.
2) Architecture map
   - Folder map and responsibilities (rendering, state, data, UI flow, tests).
3) Data schema + definitions
   - Units, encounters, items, story flags, dialogue, and validation rules.
4) Rendering rules
   - Coordinate system, layer stack, anchor conventions, camera rules.
5) State model
   - Zustand slices, session structure, and core actions.
6) Asset manifest
   - Sprite lists, naming rules, and expected paths.
7) Build/dev/test commands
   - Commands and expected outputs for dev, unit, and E2E runs.
8) E2E journeys
   - Critical flows and success criteria.
9) Minimal prompts
   - 1-2 sentence prompts that should be enough for a full rebuild.

Minimal Prompts (Examples)
- "Rebuild Vale Village v2 from docs. Match behavior and structure. No extras."
- "Recreate overworld + battle + UI flow per docs. Keep assets/paths consistent."

Acceptance Criteria (Autonomy Agent)
1) Bootstrap the repo
   - Vite + Preact + TypeScript + Zustand.
   - Scripts present: dev/build/test/test:e2e (match package.json standards).
2) Recreate core systems from docs
   - Overworld loop and layout rules (30 houses, road band, tower, transitions).
   - Battle loop and event queue behavior.
   - UI flow and screen transitions.
3) Recreate data + validation
   - Data definitions and schema constraints.
   - Startup validation behavior matches docs.
4) Match documented behavior
   - Rendering conventions (coordinate system, layer stack, anchoring).
   - Game logic per docs (progression, mechanics).
5) Verification passes
   - Unit tests pass.
   - Key Playwright journeys pass (demo or main flow).
6) Minimal guidance
   - Only high-level objectives provided; no step-by-step instructions required.

Verification Checklist
- pnpm install
- pnpm dev (app boots without errors; renders overworld/battle screens)
- pnpm test (unit tests)
- pnpm test:e2e (or targeted journey per docs)

Notes
- Do not "improve" or refactor beyond the documented spec unless asked.
- If a doc is ambiguous, ask a single clarifying question before proceeding.
