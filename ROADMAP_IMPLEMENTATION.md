ROADMAP: Implementation & Gap Analysis
=====================================

Scope
-----
Audit of rounds 1-5 against ENCYCLOPEDIA.md and GAME_MECHANICS.md focusing on: missing mechanics, TODO/GOTCHA comments in src/, type-safety issues, and state-leakage points (priority + next actions).

Executive summary
-----------------
- Core gameplay systems (queue-based battle, tower, rewards, save/replay) are implemented and documented in ENCYCLOPEDIA.md and GAME_MECHANICS.md.
- Remaining work: stabilize queue invariants, implement missing tests and error formatting, tighten type-safety, and harden save/replay contracts.
- Priorities focus on correctness (invariants/tests), determinism (RNG/replay), and UX safety (defensive normalization in UI slices).

Prioritized list of missing mechanics / gaps (with rationale)
-----------------------------------------------------------
1) Unit tests for QueueBattleService edge cases (HIGH)
   - Rationale: queue invariants are central; bugs here cause gameplay corruption and state leakage.
   - Files of concern: src/core/services/QueueBattleService.ts, src/core/validation/battleStateInvariants.ts, src/core/models/BattleState.ts
   - Next action: add focused unit tests for partial queues, dead-unit queue entries, mana overflow/rounding, and replay determinism.

2) Save/Replay API hardening & error UX (HIGH)
   - Rationale: TODOs indicate incomplete validation/error formatting and a missing ReplayPort abstraction.
   - TODOs found: src/core/validation/saveFileValidation.ts (format validation error), src/core/services/SaveService.ts (create ReplayPort), src/core/services/SaveService.ts (schema TODO: add chapter to SaveV1Schema)
   - Next action: implement ReplayPort interface, ensure SaveService returns structured Err/Ok with user-friendly messages, and add schema fields with constants.

3) Implement test stubs across core services (MEDIUM)
   - TODO test stubs found in many files under src/core/services/*.test.ts
   - Files: BattleService.test.ts, SaveService.test.ts, QueueBattleService.test.ts, LevelNormalizationService.test.ts, AIService.test.ts, TowerService.test.ts, StoryService.test.ts, ShopService.test.ts, DevModeService.test.ts, RngService.test.ts
   - Next action: prioritize QueueBattleService & SaveService tests first, then implement remaining service tests.

4) Remove magic numbers and centralize constants (MEDIUM)
   - Rationale: documents recommend named constants; several numeric literals exist in algorithms and data schemas.
   - Next action: add constants file(s) (e.g., core/constants.ts or data/constants.ts) and refactor MIN_PARTY_SIZE / MAX_PARTY_SIZE usage where missing.

5) Defensive UI normalization & clone-on-write enforcement (HIGH)
   - Rationale: UI slices and components copy/adjust queuedActions length in multiple places leading to potential state leakage if not normalized consistently.
   - Files: src/ui/state/queueBattleSlice.ts (lines adjusting queuedActions), src/ui/components/QueueBattleView.tsx and ActionQueuePanel, BattleActionMenu, ActionBar
   - Next action: centralize normalization in queueBattleSlice.normalizeBattleState and ensure selectors/components treat queuedActions as readonly; avoid in-place mutation.

Mapping of TODO / GOTCHA comments -> functional requirement
---------------------------------------------------------
- src/ui/components/RewardsScreen.tsx:84 - TODO: Add proper error logging for missing unit
  -> Requirement: Rewards UI must display recoverable errors and log missing unit references; implement guard & user message.

- src/core/validation/saveFileValidation.ts:340 - TODO: Format validation error for user display
  -> Requirement: Save loading must report structured human-friendly errors per schema failure (field, reason, remediation).

- src/core/services/SaveService.ts:104 & 536 - TODO: Create separate ReplayPort interface; add chapter to SaveV1Schema
  -> Requirement: Clear Replay abstraction for replay playback/recording; Save schema must include explicit metadata fields (chapter, version constants).

- Multiple test stubs under src/core/services/*.test.ts
  -> Requirement: Unit tests covering core behaviors; CI should fail if core invariants regress.

Type-safety issues and contract mismatches (specific)
----------------------------------------------------
- Schema vs TS model drift: Some zod schemas (src/data/schemas/BattleStateSchema.ts) carry validation messages and field shapes that must remain synchronized with TypeScript models in src/core/models/BattleState.ts. Add a CI check to assert schema <-> type compatibility where possible.

- Missing explicit readonly/mutable separation: core models use readonly arrays (e.g., queuedActions: readonly (QueuedAction|null)[]) while UI slices often clone to mutable arrays; recommend using types that express intent (ReadonlyArray vs Array) and helper routines to cast safely.

- Implicit "any" and unhandled Err/Ok shapes: ensure service return types are strongly typed (Result<T, E>) and avoid leaking 'any' to UI layers.

State leakage points (observed) and remediation
-----------------------------------------------
1) queuedActions length adjustments in UI slices
   - Observed at src/ui/state/queueBattleSlice.ts lines where queuedActions is extended/truncated.
   - Risk: UI may accidentally persist mutated arrays or mismatched lengths across renders.
   - Remediation: Always normalize via a canonical createEmptyQueue(teamSize) factory and store/read only immutable copies in global state; ensure change events produce fresh objects.

2) Multiple normalization sites
   - Several files perform local normalization/defensive checks (battleStateInvariants.ts, BattleStateSchema, queueBattleSlice.normalizeBattleState). Consolidate normalization to one canonical entrypoint when setting battle state in slices and keep validation-only in validators.

3) RNG/replay stream offsets
   - Determinism relies on RNG streams and offsets (GAME_MECHANICS notes). Ensure ReplayService and BattleService consistently consume stream offsets and that tests assert stream position after each round.

Action plan (concrete, prioritized)
-----------------------------------
1) (Immediate) Add unit tests for QueueBattleService edge cases; block deploy until passing. (owner: core/battle team)
2) (Immediate) Implement SaveService ReplayPort and improve validation error formatting for Save load UX. (owner: core/persistence)
3) (Next) Harden queue normalization: one canonical normalization call in queueBattleSlice.setBattle + enforce readonly queuedActions in selectors. (owner: ui/state)
4) (Next) Implement missing tests across services; prioritize tests flagged in TODOs. (owner: core/testing team)
5) (Ongoing) Replace magic numbers with named constants and add schema-type sync checks in CI. (owner: core/design)

Estimated risks
---------------
- Risk: refactoring queuedActions shape without simultaneous UI updates may cause transient UI failures; mitigate by feature-flagging normalization changes and adding screenshots/playwright checks.
- Risk: schema changes to SaveV1 may break existing save files; add migration path and versioned schema with explicit compatibility handling.

Files & TODOs discovered (non-exhaustive)
-----------------------------------------
- src/ui/components/RewardsScreen.tsx:84
- src/core/validation/saveFileValidation.ts:340
- src/core/services/SaveService.ts:104, 536
- src/core/services/*/*.test.ts (multiple TODO stubs)
- src/data/schemas/BattleStateSchema.ts (queuedActions validation)
- src/ui/state/queueBattleSlice.ts (queue length adjustments)

Final notes / next actions for worker
------------------------------------
- Create unit test tasks and assign top priority to QueueBattleService and SaveService tests.
- Start a small refactor to centralize queue normalization in queueBattleSlice and prepare a migration plan for save schema changes.
- Add CI checks: (1) pnpm typecheck, (2) unit tests for QueueBattleService, (3) schema <-> type compatibility assertions.

---
Generated by audit run (rounds 1-5 review) on 2026-01-06T16:17:46Z
