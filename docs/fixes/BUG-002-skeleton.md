# Bug Fix Skeleton: BUG-002 (AoE Damage Reporting)

## Bug Summary
When an Area of Effect (AoE) ability is used, the UI displays the **total summed damage** (or healing) above EVERY affected target, instead of the individual amount dealt to each specific unit. This leads to confusing and inflated numbers in the battle interface.

## Root Cause
In `src/core/services/BattleService.ts`, the `performAction` function iterates through targets to emit `hit` or `heal` events. It uses `result.damage` (the aggregate total from `executeAbility`) as the `amount` for every event, rather than tracking per-target values.

## Files to Modify
- **`src/core/services/BattleService.ts`**
    - `ActionResult` interface (approx. L45): Add per-target tracking.
    - `performAction` (approx. L227, L247): Update event emission logic.
    - `executeAbility` (approx. L400-650): Populate per-target data during execution loops.

## Fix Strategy
1. **Extend `ActionResult`**: Update the interface to include `targetResults?: Record<string, { damage?: number; healing?: number }>`.
2. **Track Individual Values**: In `executeAbility`, initialize a `targetResults` object. As the code loops through each target (including splash damage targets), record the `actualDamage` or net HP change for that specific `targetId`.
3. **Update Event Emission**: In `performAction`, check for the existence of `result.targetResults`. If present, use the target-specific value for the `amount` in `hit` and `heal` events.
4. **Maintain Fallbacks**: Keep the aggregate `result.damage` and `result.healing` for logging purposes and as a fallback if specific target data is missing.

## Code Sketch

### 1. Interface Update
```typescript
export interface ActionResult {
  damage?: number;
  healing?: number;
  message: string;
  targetIds: readonly string[];
  updatedUnits: readonly Unit[];
  hit?: boolean;
  targetResults?: Record<string, { damage?: number; healing?: number }>; // Add this
}
```

### 2. `executeAbility` (Damage Example)
```typescript
// Inside executeAbility switch (ability.type) -> 'physical'/'psynergy'
const targetResults: Record<string, { damage?: number; healing?: number }> = {};
// ... inside target loop ...
targetResults[target.id] = { damage: (targetResults[target.id]?.damage || 0) + targetDamage };
// ... similarly for splash damage and healing ...

return Ok({
  damage: totalDamage,
  targetResults,
  // ... rest of fields
});
```

### 3. `performAction` (Event Emission)
```typescript
if (result.damage !== undefined) {
  targetIds.forEach(targetId => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      // Use target-specific damage if available, else fallback to total (as it was)
      const specificAmount = result.targetResults?.[targetId]?.damage ?? result.damage;
      events.push({
        type: 'hit',
        targetId,
        amount: specificAmount || 0,
        element: ability.element,
      });
      // ...
```

## Test Cases
1. **AoE Psynergy**: Cast "Fireball" (all enemies). Ensure the damage number shown over each enemy matches their actual HP loss, not the sum of all losses.
2. **AoE Healing**: Use a "Mass Cure" ability. Ensure each ally shows their own restored HP amount (especially if some were already at near-max HP).
3. **Splash Damage**: Use an ability with `splashDamagePercent`. Verify the primary target shows full damage and secondary targets show the reduced splash damage.
4. **Single Target**: Verify standard single-target attacks still report the correct (and same) damage value.
