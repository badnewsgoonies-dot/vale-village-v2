# Option A: Shared Helpers, Separate Scenarios (Top 2 Tests)

Keep `gameplay-tour.spec.ts` (multi-screen tour + screenshots) and `gameplay-full-tower.spec.ts` (30-floor tower run + logging) as distinct tests, but centralize shared behavior into helpers so fixes land once.

## Analysis (What overlaps today)
- **Shared navigation**: Title screen -> main menu -> Battle Tower -> tower hub.
- **Shared battle orchestration**: Team select, execute rounds, handle victory/rewards/cutscenes.
- **Shared UI interrupts**: Dialogue/tutorial overlays.
- **Shared timing**: Waits and "demo" delays.

## What stays unique
- **Tour**: Overworld navigation, house entry, compendium browsing, screenshot capture cadence.
- **Full Tower**: Multi-floor loop, rest-floor handling, JSON + text logs, demo mode timing multiplier.

## Roadmap (No code yet)
1. **Inventory shared flows**: Enumerate the exact steps in both specs and mark overlap boundaries (menu/tower/battle/interrupts).
2. **Define helper surface**:
   - `helpers/navigation.ts`: `advanceToMainMenu`, `openBattleTower`, `startTowerRun`.
   - `helpers/battle.ts`: `runBattle` + overlay/cutscene helpers.
   - `helpers/dialogue.ts`: `dismissDialogueIfPresent`.
   - `helpers/timing.ts`: `createDelay`, `DelayFn`.
3. **Thread optional hooks**:
   - `runBattle` should accept callbacks (`onRound`, `onVictory`, `onStep`) so the full-tower logger can plug in.
   - `advanceToMainMenu` should allow a timeout and optional screenshot hook (for the tour).
4. **Refactor `gameplay-tour.spec.ts`**:
   - Replace inline waits/keypresses with shared helpers.
   - Keep screenshots and overworld navigation locally.
5. **Refactor `gameplay-full-tower.spec.ts`**:
   - Replace duplicated helpers with shared versions.
   - Keep logging, per-floor loop, and summary file handling locally.
6. **Document usage**:
   - Short README snippet for helper contracts and expected selectors.
   - Note any assumptions (e.g., selectors for overlays, battle view).

## Acceptance Criteria
- Both specs compile and run with no behavior change.
- Shared helpers cover 100% of overlapping logic (no duplicate cutscene/battle wait code left).
- Tour test still produces the same screenshots; full-tower still writes the same log artifacts.

## Pros / Cons
- **Pros**: Lower maintenance, clear separation, minimal risk.
- **Cons**: Two tests still need to be kept in sync for shared flows.
