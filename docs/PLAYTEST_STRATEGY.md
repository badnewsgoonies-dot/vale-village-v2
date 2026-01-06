# Playtest Strategy: The "Correct" Way
**Date:** 2026-01-02
**Status:** Proposal

## The Problem: "Crammed" E2E Testing
Current end-to-end (E2E) tests in `vale-village-v2` mimic a human player blindly:
1. Click "Start"
2. Wait 1 second (hope animation finishes)
3. Click "Tower"
4. Wait 2 seconds (hope scene loads)

**Why this fails:**
- **Race Conditions:** Animations vary in length; network/disk I/O causes frames to drop. "Sleeps" are either too long (slow tests) or too short (flaky tests).
- **Brittle Selectors:** Moving a button breaks the test even if the logic works.
- **Coupling:** To test the "Battle" screen, you *must* successfully navigate the "Title" and "Overworld" screens first. A bug in the Title screen blocks testing the Battle engine.

## The Solution: Gray-Box State Orchestration
Instead of treating the game as a black box, we treat it as a state machine we can observe and manipulate.

### 1. Architecture: The `window.gameStore` Hook
The game uses **Zustand** for state management (`src/store/gameStore.ts`). By exposing this store to the `window` object during tests, Playwright can:
- **Read State:** `window.gameStore.getState().flow.screen` (Exact truth, no DOM guessing).
- **Write State:** `window.gameStore.getState().setScreen('battle')` (Instant teleport).
- **Monitor Transitions:** `window.gameStore.getState().flow.isTransitioning` (Perfect synchronization).

### 2. Implementation: "Smart" Test Fixtures
We define custom Playwright helpers that communicate with the internal store.

#### A. State-Aware Waiting (No more `sleep`)
```typescript
// BAD
await page.waitForTimeout(1000);

// GOOD
await page.waitForFunction(() => !window.gameStore.getState().flow.isTransitioning);
await page.waitForFunction(() => window.gameStore.getState().flow.screen === 'battle');
```

#### B. Direct State Injection (Teleportation)
Instead of walking to the tower:
```typescript
await page.evaluate(() => {
  const store = window.gameStore.getState();
  store.setScreen('tower');
  store.setInventory(mockInventory); // Pre-load potions
});
```
This isolates the "Tower" test from "Overworld" bugs.

### 3. Determinism: Seeded RNG
The game uses `XorShift32`. We should inject a seed at startup:
```typescript
// In test setup
await page.goto('/?seed=12345');
```
This ensures every "random" enemy encounter is identical across runs, making debugging trivial.

## Proposed Workflow
1. **Modify `src/main.tsx`**: Expose `useGameStore` to `window` if `import.meta.env.MODE === 'test'`.
2. **Create `tests/e2e/helpers/state.ts`**: Encapsulate the `page.evaluate` calls.
3. **Refactor Tests**:
   - `gameplay-tour.spec.ts`: Keep as "True E2E" (Human mimic) for verifying the "Happy Path".
   - `gameplay-full-tower.spec.ts`: Convert to "Gray Box" (State driven) for deep logic verification.

## Benefits
- **Speed:** Skip animations and walking; jump straight to the fight.
- **Stability:** Tests wait for *data*, not *pixels*.
- **Coverage:** We can test edge cases (e.g., "Inventory Full" error) by injecting a full inventory, which is tedious to do manually.
