# BUG-013: Equipment Elemental Resistance Ignored

## Bug Summary
Equipment elemental resistance is non-functional for many items and damage types. Currently:
1. `calculatePsynergyDamage` only checks the `armor` slot for `elementalResist`, ignoring helmets, boots, and accessories.
2. `calculatePhysicalDamage` (and `applyDamageModifiers`) does not check for equipment elemental resistance at all, even when the physical ability has an element.

## Root Cause
The damage calculation logic in `src/core/algorithms/damage.ts` explicitly targets only the `armor` slot in one specific function and omits the check entirely in others.

- In `calculatePsynergyDamage`:
  ```typescript
  const resist = defender.equipment.armor?.elementalResist || 0;
  if (ability.element && resist > 0) {
    rawDamage = rawDamage * (1 - resist);
  }
  ```
- In `applyDamageModifiers`:
  It only accounts for `statusEffects`, missing `equipment` entirely.

## Files to Modify
- `src/core/algorithms/damage.ts`

## Fix Strategy
1. Implement a helper function `calculateTotalEquipmentElementalResistance(unit: Unit): number` that iterates through all equipment slots and sums their `elementalResist` values.
2. Update `applyDamageModifiers` to incorporate this equipment resistance.
3. Remove the redundant and incomplete armor-only check from `calculatePsynergyDamage`.

## Code Sketch

### New Helper Function
```typescript
/**
 * Calculate total elemental resistance from all equipped items
 * Sums the elementalResist property from all slots
 */
export function calculateTotalEquipmentElementalResistance(unit: Unit): number {
  const { equipment } = unit;
  let totalResist = 0;

  for (const slot of Object.values(equipment)) {
    if (slot?.elementalResist) {
      totalResist += slot.elementalResist;
    }
  }

  return totalResist;
}
```

### Modified `applyDamageModifiers`
```typescript
export function applyDamageModifiers(
  baseDamage: number,
  abilityElement: Element | undefined,
  defender: Unit
): number {
  let modifiedDamage = baseDamage;

  // 1. Apply elemental resistance/weakness from status effects AND equipment
  if (abilityElement && abilityElement !== 'Neutral') {
    // Equipment resistance
    const equipmentResist = calculateTotalEquipmentElementalResistance(defender);
    
    // Status effect resistance
    const resistanceEffects = defender.statusEffects.filter(
      effect => effect.type === 'elementalResistance' && effect.element === abilityElement
    ) as Array<Extract<typeof defender.statusEffects[number], { type: 'elementalResistance' }>>;

    const totalStatusResist = resistanceEffects.reduce((sum, mod) => sum + mod.modifier, 0);

    // Total factor = (1 - equipmentResist) * (1 - totalStatusResist)
    // Or additive? Usually additive in this engine's style for same-source, 
    // but equipment and status are different sources. 
    // Let's stick to multiplicative between categories or additive total.
    // Given status effects use "factor = 1 - totalResist", let's use:
    const totalFactor = Math.max(0, 1 - (equipmentResist + totalStatusResist));
    modifiedDamage *= totalFactor;
  }
  
  // ... rest of function ...
}
```

## Test Cases
1. **Physical Elemental Attack:** Verify that a unit wearing `COSMOS_SHIELD` (0.25 resist) takes reduced damage from an elemental physical attack (e.g., "Gaia").
2. **Multi-slot Resistance:** Verify that a unit wearing both `IRIS_ROBE` (0.2) and `ELEMENTAL_STAR` (0.15) receives a total of 0.35 resistance.
3. **Psynergy Damage:** Verify that non-armor slots correctly reduce Psynergy damage.
4. **Neutral Damage:** Verify that `elementalResist` does NOT reduce damage from "Neutral" element attacks or non-elemental physical attacks.
