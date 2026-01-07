ROADMAP: Prioritized Implementation Backlog
==========================================

Purpose
-------
This document is the prioritized implementation backlog derived from the rounds 1-5 audit and subsequent analysis. Each item is prioritized (P0, P1, P2) and contains a clear Definition of Done (DoD) so work can be handed off, implemented, and verified with measurable acceptance criteria.

Memory check
------------
- Memory briefing run before this update and previous audit artifacts (phase-1 content-audit, rounds 1-5) were referenced and incorporated. Key findings (queue invariants, Save/Replay TODOs, RNG determinism, schema drift) are included below.
- Prototype content piece present:
  - src/data/definitions/mireToad.ts — Mire Toad enemy data (prototype enemy).
  - src/data/definitions/enemies.ts — ENEMIES registry updated to include Mire Toad.
  - tests/unit/lumen_fawn.test.ts — Lumen-Fawn test scaffold exists.
- Memory verification: prototype locations and names recorded in swarm memory (mireToad at src/data/definitions/mireToad.ts, test at tests/unit/lumen_fawn.test.ts).

Priority legend
---------------
- P0: Blockers for correctness, determinism, or user data integrity; must be fixed before release.
- P1: Important improvements that reduce technical debt and improve reliability/maintainability.
- P2: Nice-to-have features and refactors; schedule after P0/P1 velocity completes.

Implementation order (refined)
----------------------------
Based on dependency analysis, execute P0 items in this order:
  1) RNG determinism & stream consolidation — centralize RNG streams and eliminate duplicated offsets.
  2) Battle invariants & queuedActions normalization — ensure canonical battle state shape and no in-place mutations.
  3) Save/Replay hardening and ReplayPort implementation — implement ReplayPort and schema versioning once deterministic behavior is established.

This ordering minimizes rework: consolidate RNG first so replay and battle tests rely on a single source of truth for random streams.

Backlog (by priority)
---------------------
P0 - Core correctness & determinism
  1) Battle v2 / Queue invariants (owner: core/battle)
     - Summary: Fix state-leakage and invariants around queuedActions and core battle queue processing.
     - DoD:
       - canonical normalizeBattleState(battleState) exists and is the only routine that adjusts queuedActions length/shape.
       - queuedActions is represented as a ReadonlyArray in core logic and a canonical fixed-length vector is stored in state.
       - Unit tests added: partial queues, dead-unit queued entries, mana overflow/underflow, normalization after UI write-back.
       - CI: all relevant tests pass and coverage for core/battle increases by >=10%.
  2) Save/Replay hardening (owner: core/persistence)
     - Summary: Implement a ReplayPort abstraction, ensure save schema versioning, and produce structured user-facing validation errors.
     - DoD:
       - ReplayPort interface added and used by SaveService/ReplayService for record/playback.
       - SaveV1Schema includes SAVE_SCHEMA_VERSION and migration metadata; migrations exist for older versions or clear rejection with remediation.
       - Save load errors return structured {field, reason, remediation} and surfaced in UI; unit tests cover common schema failures.
       - Determinism tests: record-and-replay for a 3-round battle assert identical final states and RNG stream offsets.
  3) RNG determinism & Replay tests (owner: core/rng)
     - Summary: Ensure RNG streams, offsets and replay metadata are consistent and covered by tests.
     - DoD:
       - RNG stream constants centralized and documented; duplicated stream offsets eliminated.
       - Replay metadata includes explicit streamOffset and tests assert streamOffset equality at round boundaries.
       - Unit/integration tests validate deterministic replay for recorded battles.

P1 - Reliability, tests, and UX
  4) UI normalization & clone-on-write enforcement (owner: ui/state)
     - Summary: Centralize normalization and prevent in-place mutations in UI slices.
     - DoD:
       - queueBattleSlice exposes normalizeBattleState and is the canonical setter for battle state.
       - Selectors return ReadonlyArray for queuedActions; components handle them without mutating.
       - Playwright screenshot/regression tests added to assert no visual regressions after change.
  5) Tests for core services (owner: core/testing)
     - Summary: Implement TODO test stubs prioritized by risk (QueueBattleService, SaveService first).
     - DoD:
       - QueueBattleService.test.ts and SaveService.test.ts implemented and passing.
       - At least 50% of remaining test stubs under src/core/services/ are implemented or triaged with owners.
       - CI requires tests to pass before merging changes touching core services.
  6) Constants & magic-number removal (owner: core/design)
     - Summary: Introduce central constants and replace top magic numbers.
     - DoD:
       - src/core/constants.ts (or equivalent) added with MIN_PARTY_SIZE, MAX_PARTY_SIZE, SAVE_SCHEMA_VERSION, PRNG_WARMUP_ITERATIONS, RNG_STREAM_* constants.
       - Top 10 magic numbers in core algorithms replaced and code passes pnpm typecheck.

P2 - Improvements and documentation
  7) Shop System & UX polish (owner: gameplay/shop)
     - Summary: Complete shop workflows, error handling, and tests.
     - DoD:
       - Shop purchase flow covered by unit tests and one Playwright end-to-end scenario.
       - Edge-cases (insufficient funds, inventory limits) produce structured, localized error messages.
  8) Tower features and normalization (owner: gameplay/tower)
     - Summary: Hardening of tower progression, rewards, and RNG interactions.
     - DoD:
       - TowerService uses centralized RNG and constants; difficulty scaling constants documented.
       - Integration tests for tower runs added; no flaky behavior in CI.
  9) Developer productivity (docs, PR templates, CI) (owner: infra)
     - Summary: Add PR checklist, CI steps for schema/type sync, tests and typecheck gating.
     - DoD:
       - PR template includes required items (run pnpm test, pnpm typecheck, Schema/Type check script).
       - CI job added for schema <-> type compatibility assertion.

Technical debt (Cleanse run integration)
----------------------------------------
Items uncovered or reiterated by the recent 'Cleanse' audits have been integrated into the backlog above and include:
- Duplicate RNG stream offsets and magic numbers (PRNG warmup iterations, denominators) → P0/P1 depending on risk.
- Save schema drift and missing ReplayPort abstraction → P0 Save/Replay hardening.
- queuedActions normalization spread across UI and core → P0 UI normalization & Battle invariants.
- Numerous test stubs and TODO comments across core services → P1 Tests prioritization and implementation.
- Missing constants and magic numbers in core algorithms → P1 Constants consolidation.

Cross-cutting acceptance criteria
--------------------------------
- All P0 items must have passing unit tests and deterministic replay tests before release.
- Schema changes must include migration strategies and explicit schema versioning.
- No in-place mutations in global state: enforce via readonly types and cloning factories where appropriate.
- CI adds checks: pnpm typecheck, unit tests, schema<->type sync, and a reproducible replay test job.

Files & TODOs mapped (short list)
--------------------------------
- src/core/services/QueueBattleService.ts (tests: QueueBattleService.test.ts)
- src/core/services/SaveService.ts (implement ReplayPort; SaveV1Schema updates)
- src/core/validation/saveFileValidation.ts (structured error output)
- src/ui/state/queueBattleSlice.ts (normalizeBattleState API)
- src/data/schemas/BattleStateSchema.ts (queuedActions validation)
- src/ui/components/RewardsScreen.tsx (error guards)

Next actions (immediate)
------------------------
1) Create issues/tasks and assign owners for the top P0 items: Battle invariants, Save/Replay hardening, and RNG determinism. Include DoD and CI gating in each issue.
2) Implement minimal ReplayPort and record/replay deterministic test (small PR); run in CI.
3) Implement QueueBattleService unit tests covering the DoD cases.

Risks
-----
- Schema changes without migration can break existing user saves; provide clear migration scripts or transparent rejection with remediation.
- Large refactors of queuedActions require staged rollouts and Playwright checks to avoid UX regressions.

Lesson
------
Centralizing normalization and treating queuedActions as canonical fixed-length vectors significantly reduces the surface area for state leakage and simplifies deterministic replay testing.

Change log
----------
- This file was restructured into a prioritized backlog with explicit Definition of Done entries and Cleanse-run technical debt integrated (2026-01-06).

Finalization
------------
- Roadmap finalized and verified against repository on 2026-01-06T21:46:28Z. Prototype enemy verified in repo at src/data/definitions/mireToad.ts and referenced in src/data/definitions/enemies.ts (id: 'mire-toad'); lumen-fawn test scaffold present at tests/unit/lumen_fawn.test.ts.
- Top P0 items prioritized with DoD; next step is creating tracked issues and minimal PRs for ReplayPort, QueueBattleService tests, and RNG stream centralization.
