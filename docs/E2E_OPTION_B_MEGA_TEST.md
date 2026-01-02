# Option B: Mega Test Merge

This approach merges both tests into a single, parameterized test suite. The "Journey" becomes just "Floor 1 of Tower" or a specific configuration of the main test runner.

## Analysis
The "Journey" test is effectively just "Run 1 floor of Tower". The `gameplay-full-tower.spec.ts` already has logic to run N floors.

## Implementation Plan

1.  **Enhance `gameplay-full-tower.spec.ts`**:
    *   Add configuration for `TARGET_FLOORS` (default 30, but can be 1).
    *   Add a mode `JOURNEY_MODE` that asserts stricter pre-conditions (title screen -> main menu) if needed, though the full tower test does this too.

2.  **Delete `gameplay-journey.spec.ts`**:
    *   Replace it with a script alias `npm run test:e2e:journey` that calls the tower test with `FLOORS=1` env var.

3.  **Consolidate Logic**:
    *   Single source of truth for all battle interaction code.
    *   Unified logging system (the one in full-tower is better).

## Pros
- **Single Codebase**: Only one test file to maintain.
- **Better Tooling**: The logging and "Demo Mode" from the tower test becomes available for the journey test automatically.

## Cons
- **Complexity**: The test file becomes larger and slightly more complex to handle both "quick check" and "long run" scenarios.
- **Fragility**: If the "Full Tower" logic breaks, the "Smoke" test also breaks. Option A isolates the smoke test better.

## Filename
- Ideally renames `gameplay-full-tower.spec.ts` to `gameplay-tower-system.spec.ts` or similar, but can keep existing name if compatibility is required.
