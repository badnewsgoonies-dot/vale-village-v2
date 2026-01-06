# LANE_BUGS - Initial scan (20 issues)

1. File: src/screens/OverworldMapV3.tsx
   Line: 54
   Description: Casting canvas to `any` (sprites[key] = canvas as any) loses type safety and may hide runtime type mismatches when rendering sprites.
   Severity: Medium

2. File: src/screens/OverworldMapV4.tsx
   Line: 110
   Description: Casting canvas to `any` (sprites[key] = canvas as any) - same type-safety risk as OverworldMapV3.
   Severity: Medium

3. File: src/core/validation/saveFileValidation.ts
   Line: 340
   Description: TODO left in validation: "Format validation error for user display" — missing user-facing error formatting may lead to poor UX when saves are invalid.
   Severity: Low

4. File: src/core/validation/validateAll.ts
   Line: 74
   Description: Using `delete (shopData as any).unlockCondition` relies on `any` cast and mutates input via a typed-unsafe operation which can hide schema issues.
   Severity: Medium

5. File: src/ui/sprites/SimpleSprite.tsx
   Line: 214
   Description: Leftover `console.log` statement for debugging causes noisy logs in production and may leak internal state.
   Severity: Low

6. File: src/core/algorithms/status.ts
   Line: 146
   Description: Using `status.type as any` when checking immunities bypasses type system and could mask invalid status shapes causing runtime errors.
   Severity: Medium

7. File: src/core/save/migrations.ts
   Line: 13
   Description: `export type Migrator = (old: any) => any;` — wide `any` types for migration functions risk silent data corruption during migrations.
   Severity: High

8. File: src/core/save/migrations.ts
   Line: 52
   Description: Mapping over saved units uses `(unit: any)` and creates `(updatedUnit: any)` which loses strong typing during migrations and can introduce subtle bugs.
   Severity: High

9. File: src/ui/sprites/BackgroundSprite.tsx
   Line: 152
   Description: `console.log` left in background sprite loader - noisy debug output in production.
   Severity: Low

10. File: src/ui/state/gameFlowSlice.ts
    Line: 361
    Description: `console.log('Tower Battle: Normalized team to level', ...)` logging internal state; should use a debug logger or be removed for production builds.
    Severity: Low

11. File: src/ui/components/RewardsScreen.tsx
    Line: 34
    Description: Inline cast of style object `as any` for CSS variables may hide incorrect style shapes and break layout on some browsers.
    Severity: Medium

12. File: src/ui/components/RewardsScreen.tsx
    Line: 84
    Description: `// TODO: Add proper error logging for missing unit` — missing error handling for missing unit data may cause silent UI failures.
    Severity: Low

13. File: src/main.tsx
    Line: 17
    Description: Assigning internals to global window with `(window as any).gameStore = useGameStore` leaks implementation details globally and uses `any` casts — potential security and debugging concerns.
    Severity: Medium

14. File: src/core/services/SaveService.ts
    Line: 536
    Description: `// TODO: Add chapter to SaveV1Schema` — incomplete save schema could cause compatibility or data-loss issues when users expect chapter state.
    Severity: Medium

15. File: src/core/services/QueueBattleService.ts
    Line: 893
    Description: Returns `null` when battle created with no enemies; silently returning null may propagate nulls and cause downstream NPEs rather than explicit error handling.
    Severity: High

16. File: src/core/services/QueueBattleService.ts
    Line: 897
    Description: Returns `null` when battle created with no players; similar silent failure mode — should surface clearer error or validation.
    Severity: High

17. File: src/core/services/BattleService.ts
    Line: 805
    Description: Multiple `return null` branches in core battle logic can lead to silent failures during battle creation/execution instead of deterministic error handling.
    Severity: High

18. File: src/App.tsx
    Line: 558
    Description: `return null;` in rendering branch may hide UI errors; several branches returning null should be audited for intentionality and documented fallback behavior.
    Severity: Medium

19. File: src/infra/save/LocalStorageSavePort.ts
    Line: 35
    Description: `if (!raw) return null;` — silently returning null on malformed local storage data may lose user data without recovery or clear diagnostics.
    Severity: High

20. File: src/ui/components/overworld/OverworldCanvas.tsx
    Line: 118
    Description: Using `useStore((s: any) => s.team)` hides the shape of global store and allows accidental misuse of store fields; reduces maintainability and type guarantees.
    Severity: Medium


Notes:
- Line numbers taken from a quick grep scan; confirm exact lines with an editor if precise patching is needed.
- Many issues are type-safety (any) and leftover debug logs/TO-DOs; prioritization suggested: migrations/any usages and silent null returns first (High), then widespread `any`/global leaks (Medium), then console logs and TODOs (Low).
