# Codebase Analysis — vale-village-v2

Generated: 2026-01-05

Summary
-------
This document summarizes a static review of the codebase focused on architecture, state management (Zustand), Preact component structure, test surface, and technical debt.

Architecture & State Management (Zustand)
-----------------------------------------
- Centralized store pattern: a single store is composed from multiple slice factory functions (src/ui/state/store.ts → createXSlice). This is a clear, modular approach and aligns with "feature slice" best-practices.
- Slice factories (createQueueBattleSlice, createTeamSlice, etc.) encapsulate domain logic and expose typed actions/selectors which improves testability and separation of concerns.
- Devtools middleware is conditionally enabled in DEV builds (good practice).
- Selectors are used liberally in components (many useStore(...) calls selecting single properties) which reduces unnecessary re-renders — the team uses narrow selectors consistently.
- Some cross-slice coupling exists: many slices accept or call into other slice types (e.g., queue slice references GameFlow, Rewards, TowerSlice types). This coupling is manageable but warrants vigilance to avoid circular dependencies.

Component Structure (Preact) & Reusability
-----------------------------------------
- Components are organized by feature (battle/, overworld/, etc.) which makes locating code intuitive and supports modularity.
- Several large view components (e.g., QueueBattleView.tsx) combine rendering, animation timers, and orchestration logic; these are highly stateful and contain many responsibilities.
  - Pros: Single-file visibility of complex UI behavior.
  - Cons: Harder to unit test; greater surface for regressions; maintenance burden when changing animation/timing logic.
- Reusable smaller components exist (BattleManaBar, BattlePortraitRow, SimpleSprite), but there is room to extract more rendering/animation helpers from large components.
- Inline styles and many hard-coded layout numbers (widths, heights, timing values) are used throughout; this is pragmatic for pixel-art games but reduces themeability and increases duplication.

Patterns & Strengths
--------------------
- Strong typed slices and TypeScript usage across store and core models increases safety.
- Core game logic is located under src/core/ (models, services, algorithms) and is consumed by slices — good separation of UI vs game logic.
- Slices frequently call into core services (QueueBattleService, BattleState updates) keeping complex algorithms out of UI code.
- Selective use of structuredClone and normalization functions improves resilience to malformed input.

Testing Coverage & CI Observations
----------------------------------
- Project contains Playwright E2E tests under tests/e2e/ (several full-run specs present). Vitest/unit tests are used elsewhere per repository memory but unit test coverage for core algorithms is not obvious from a cursory pass.
- E2E focus is strong, which verifies end-to-end behavior but leaves opportunity to expand unit tests around core services (QueueBattleService, LevelNormalizationService, TowerService) and store slices.

Technical Debt & Issues
-----------------------
- Inline magic numbers: many hard-coded timings (e.g., 200, 400, 1150, 1400 ms), sprite scales, and layout constants exist. Recommend consolidating into named constants (animationTiming, layoutConstants) for clarity and maintainability.
- Large components with mixed responsibilities (render + animation + state orchestration). These are candidates for refactor into smaller presentational components + controller hooks (e.g., useBattleEventProcessor) to make logic testable.
- Some slices create ephemeral timers (setTimeout) stored in Maps at module scope (critFlashTimeouts). These are fine but need robust cleanup and unit tests to avoid leaks.
- Cross-slice type imports are numerous; monitor for circular dependencies if slices evolve.
- A few default seeds / literals exist (rngSeed: 1337) — acceptable for deterministic dev behavior but should be configurable in production or tests via constants.

Recommendations (next steps)
----------------------------
1. Introduce a small `src/ui/constants/` module: export animation durations, default sizes, z-index map, and tutorial timing constants to remove magic numbers.
2. Create controller hooks for complex UI logic (e.g., useBattleEventProcessor, useFloatingNumbers) to move effects & timers out of large components and enable unit testing.
3. Expand unit tests for core services and store slices: add focused tests for QueueBattleService, LevelNormalizationService, and key slice actions to raise confidence and reduce E2E brittleness.
4. Audit slice coupling: ensure no circular imports and prefer passing only the minimal callbacks between slices where possible.
5. Add a coding guideline to prefer named constants (no magic numbers) and limit inline styles in very large components (move to small style objects or CSS modules if desired).

Concrete Quick Wins
-------------------
- Replace explicit numeric timeouts with named constants (e.g., CRIT_FLASH_MS, FLOAT_NUMBER_MS) in queueBattleSlice.ts and QueueBattleView.tsx.
- Extract floating-number and action-timer logic into useFloatingNumbers hook and unit-test that hook.
- Add a few unit tests for QueueBattleSlice.setBattle, queueUnitAction, and executeQueuedRound to validate edge cases (KO unit, out-of-mana, null battle).

Summary
-------
The codebase demonstrates solid architecture: typed core logic separated from UI, feature-sliced Zustand store, and focused E2E tests. Primary quality risks are scattered magic numbers and large stateful components that mix rendering and orchestration. Addressing those with small refactors and constants will improve maintainability and testability.

Appendix: Files reviewed (non-exhaustive)
----------------------------------------
- src/ui/state/store.ts
- src/ui/state/queueBattleSlice.ts
- src/ui/components/QueueBattleView.tsx
- src/ui/components/overworld-v2/OverworldV2.tsx
- tests/e2e/*


Telemetry & Input Bridge Integration Plan
----------------------------------------
Goal: Provide a low-overhead, opt-in runtime telemetry surface and a minimal input bridge that enables external capture, replay, and deterministic debugging without coupling telemetry code into core game logic.

Required runtime globals (explicit):
- window.__TELEMETRY__ — object API: { send(event: TelemetryEvent): void, flush(): Promise<void> }. Default: noop implementation when not present.
- window.__INPUT_BUFFER__ — minimal input buffer/ring API: { push(event), drain() } to capture raw input (keyboard/gamepad/touch) for recording or external inspection.
- Time.timeScale — exposeable property from the core time module to allow playback speed control for replay/debugging.

Recommended hook points (low-friction, read-only hooks into existing code):
- src/App.tsx — initialize window.__TELEMETRY__ noop and attach opt-in loader; emit lifecycle events (app:start/app:stop, route:change).
- src/ui/components/overworld-v2/OverworldV2.tsx — push raw input events into window.__INPUT_BUFFER__ and emit sampled input telemetry events.
- Core game loop / Time module (e.g., src/core/Time.ts or equivalent) — ensure Time.timeScale is publicly accessible and emit tick telemetry (tick:delta) at a configurable sampling rate.
- Core services (src/core/services/QueueBattleService.ts, src/core/services/SaveService.ts, ReplayPort) — emit deterministic markers (battle:roundStart, rngOffset, save:load) to telemetry; ReplayPort should accept/emit telemetry markers to validate replays.
- UI state slices (src/ui/state/queueBattleSlice.ts, src/ui/state/devModeSlice.ts) — emit higher-level events (battle:queue:enqueue, battle:round:resolve, dev:telemetry:toggle) through window.__TELEMETRY__.send.

Data & privacy constraints:
- Telemetry events must be minimal JSON objects: { ts, eventType, payload } and MUST NOT contain PII. Provide schemaVersion on events for forward compatibility.
- Default behavior must be a no-op implementation so there is zero runtime overhead when telemetry is not enabled; employ sampling to limit performance and storage impact.

Minimal API surface (suggested):
- window.__TELEMETRY__ = { send: (event)=>void, flush: ()=>Promise<void> }
- window.__INPUT_BUFFER__ = { push(event), drain(): event[] }

Implementation notes and non-goals:
- Keep telemetry code decoupled from core logic; emit events from existing slices/services rather than importing telemetry into core algorithms.
- Do not record raw player-identifying information; keep events focused on deterministic markers, timing, and non-sensitive state.

Risks & mitigations:
- Performance: mitigate by providing sampled events and a noop default implementation. Measure overhead in a dev build before shipping.
- Privacy/PII: enforce schema and review events to ensure no user-identifying data is emitted.
- Determinism drift: Telemetry should record RNG stream offsets and deterministic markers to help diagnose drift rather than altering determinism.

-- End of analysis
