# Bug Fix Skeleton: BUG-011 Revival Targeting

## Bug Summary
Revival abilities (e.g., those with `revive: true` or `revivesFallen: true`) are non-functional because the targeting and battle logic unconditionally filter out KO'd units. This prevents players and AI from selecting or applying effects to fallen party members.

## Root Cause
The codebase assumes that most actions only target living units and applies a `!isUnitKO(u)` filter at multiple levels:
1.  **Targeting Logic:** `resolveTargets` and `getValidTargets` in `src/core/algorithms/targeting.ts` filter out KO'd units for all ally/enemy target types.
2.  **Battle Execution:** `BattleService.ts` re-validates targets before execution and strips away any KO'd units.
3.  **AI Scoring:** `AIService.ts` filters out KO'd units when calculating the utility of an ability, making the AI think revival has no valid targets.

## Files to Modify
- `src/core/algorithms/targeting.ts`: Lines 24-45 (resolveTargets), 82-95 (getValidTargets)
- `src/core/services/BattleService.ts`: Lines 170-179 (target validation)
- `src/core/services/AIService.ts`: Lines 86-90 (AI target filtering)

## Fix Strategy
1.  **Update Targeting:** Modify `resolveTargets` and `getValidTargets` to accept a `canTargetKO` flag, derived from `ability.revive || ability.revivesFallen`. Only apply the `!isUnitKO(u)` filter if `canTargetKO` is false.
2.  **Update Battle Service:** In `BattleService.performAction`, relax the "alive" check if the ability has revival properties.
3.  **Update AI Service:** Allow the AI to "see" and score KO'd units if the ability being evaluated can revive.
4.  **Consistency:** Ensure `filterValidTargets` (which already has some revival logic) is the primary source of truth for target validity where possible.

## Code Sketch
```typescript
// src/core/algorithms/targeting.ts
const canTargetKO = ability.revive || ability.revivesFallen;

// In resolveTargets / getValidTargets switch cases:
return units.filter(u => canTargetKO || !isUnitKO(u));

// src/core/services/BattleService.ts
const canTargetKO = ability.revive || ability.revivesFallen;
const validTargets = targets.filter(t => {
  const exists = state.playerTeam.units.some(u => u.id === t.id) ||
                 state.enemies.some(u => u.id === t.id);
  return exists && (canTargetKO || !isUnitKO(t));
});
```

## Test Cases
1.  **Scenario 1: Manual Revival**
    - Party member A is KO'd (0 HP).
    - Player selects "Revive" ability.
    - **Expected:** Party member A is selectable in the UI and can be targeted.
2.  **Scenario 2: Healing vs KO**
    - Party member A is KO'd (0 HP).
    - Player selects "Cure" ability (no revival).
    - **Expected:** Party member A is NOT selectable and cannot be targeted.
3.  **Scenario 3: AI Revival**
    - Enemy healer has a revival skill. One enemy is KO'd.
    - **Expected:** AI scores the revival skill as high priority and successfully targets the KO'd unit.
