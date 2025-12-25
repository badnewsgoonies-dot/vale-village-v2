# BUG-012 Skeleton: Immunity blocks positive effects

## Bug Summary
The "all" status immunity logic incorrectly blocks positive status effects (such as buffs and healing over time). When a unit has an immunity status with `all: true`, the system prevents any new status from being applied, regardless of whether it is beneficial or harmful.

## Root Cause
In `src/core/algorithms/status.ts`, the `isImmuneToStatus` function returns `true` for any status check if the unit has an active immunity with `all: true`. It does not verify if the status being applied is actually a negative effect.

```typescript
// Current implementation in src/core/algorithms/status.ts
export function isImmuneToStatus(unit: Unit, statusType: string): boolean {
  const immunities = unit.statusEffects.filter(s => s.type === 'immunity');

  // Check if any immunity grants "all" protection
  if (immunities.some(s => s.all)) {
    return true; // <--- This blocks everything
  }
  // ...
}
```

## Files to Modify
- `src/core/algorithms/status.ts`

## Fix Strategy
1.  **Update `isNegativeStatus`**: Ensure it correctly identifies all negative status types, including "weakness" (negative `elementalResistance`).
2.  **Update `isImmuneToStatus`**: Change the signature to accept the full `StatusEffect` object instead of just the type string. First check if the status is negative; if not, return `false` (not immune).
3.  **Update `applyStatusToUnit`**: Pass the full `newStatus` object to `isImmuneToStatus`.

## Code Sketch

```typescript
// src/core/algorithms/status.ts

/**
 * Check if a status effect is negative (can be cleansed/blocked by immunity)
 */
export function isNegativeStatus(status: { type: string; [key: string]: any }): boolean {
  if (['poison', 'burn', 'freeze', 'paralyze', 'stun'].includes(status.type)) {
    return true;
  }
  if (status.type === 'debuff') {
    return true;
  }
  // Elemental weakness is also a negative status
  if (status.type === 'elementalResistance' && typeof status.modifier === 'number' && status.modifier < 0) {
    return true;
  }
  return false;
}

/**
 * Check if unit's immunity blocks a status
 */
export function isImmuneToStatus(unit: Unit, status: any): boolean {
  // Positive effects are never blocked by immunity
  if (!isNegativeStatus(status)) {
    return false;
  }

  const immunities = unit.statusEffects.filter(s => s.type === 'immunity');

  // Check if any immunity grants "all" protection (against negative statuses)
  if (immunities.some(s => s.all)) {
    return true;
  }

  // Check if any immunity specifically lists this status type
  return immunities.some(s => s.types?.includes(status.type));
}

export function applyStatusToUnit(
  unit: Unit,
  newStatus: any
): Unit {
  // Check immunity (immunity statuses themselves always replace existing ones)
  if (newStatus.type !== 'immunity' && isImmuneToStatus(unit, newStatus)) {
    return unit;
  }
  // ... replacement logic
}
```

## Test Cases
- **Case 1: Beneficial Buff**: Unit with `all: true` immunity receives a `buff`. Expected: Status is applied.
- **Case 2: Heal Over Time**: Unit with `all: true` immunity receives `healOverTime`. Expected: Status is applied.
- **Case 3: Harmful Debuff**: Unit with `all: true` immunity receives a `debuff`. Expected: Status is blocked.
- **Case 4: Poison**: Unit with `all: true` immunity receives `poison`. Expected: Status is blocked.
- **Case 5: Specific Immunity**: Unit with immunity to `['poison']` receives `burn`. Expected: Status is applied.
- **Case 6: Elemental Weakness**: Unit with `all: true` immunity receives `elementalResistance` with `modifier: -0.2`. Expected: Status is blocked.
- **Case 7: Elemental Resistance**: Unit with `all: true` immunity receives `elementalResistance` with `modifier: 0.2`. Expected: Status is applied.
