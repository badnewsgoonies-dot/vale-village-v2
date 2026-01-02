# Option B: Unified Mega Runner (Tour + Full Tower Combined)

Combine `gameplay-tour.spec.ts` and `gameplay-full-tower.spec.ts` into a single "mega" spec that can run one or both phases via env flags. This makes a single source of truth for navigation + battle behavior, but increases coupling.

## Approach
- **Single spec** with two phases:
  - **Phase 1 (Tour)**: Title -> Menu -> New Game -> Overworld -> House -> Compendium -> Tower Hub -> First Battle (screenshots optional).
  - **Phase 2 (Tower Run)**: Full 30-floor loop with logging.
- **Mode flags** (env):
  - `RUN_TOUR=true|false` (default true)
  - `RUN_TOWER=true|false` (default false for CI)
  - `FLOORS=N` (default 30)
  - `TAKE_SHOTS=true|false`
  - `DEMO_MODE=true|false`

## Roadmap (No code yet)
1. **Define a shared context object**:
   - `delay`, `log`, `shot`, `timeouts`, `selectors`.
   - Optional hooks: `onPhaseStart`, `onRoundExecuted`.
2. **Build two phase functions**:
   - `runTourPhase(page, ctx)` returns to tower hub.
   - `runTowerPhase(page, ctx, floors)` runs N floors and logs.
3. **Create a single spec entrypoint**:
   - Read env flags.
   - Execute phases conditionally.
   - Ensure the end of Phase 1 leaves the app in the right state for Phase 2.
4. **Consolidate artifacts**:
   - Screenshot directory scoped per run (`/tmp/vv2-tour`).
   - Log files per run (`test-results/tower-run-*.json`).
5. **Add runnable scripts**:
   - `test:e2e:tour`, `test:e2e:tower`, `test:e2e:combined` with env flags.
6. **Document expectations**:
   - Expected runtime per mode.
   - Failure triage hints (where to look: screenshots vs logs).

## Acceptance Criteria
- A single spec can reproduce both current behaviors with flags.
- `RUN_TOUR` alone matches current screenshot flow.
- `RUN_TOWER` alone matches current tower log output.
- Combined mode runs end-to-end without reloading state mid-way.

## Pros / Cons
- **Pros**: One source of truth, consistent battle logic, easy to toggle modes.
- **Cons**: Larger, more complex spec; higher blast radius when it fails; harder to parallelize.
