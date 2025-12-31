import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { getValidTargets, resolveTargets } from '../../src/core/algorithms/targeting';
import type { Ability } from '../../src/data/schemas/AbilitySchema';

describe('BUG-011: Revival Target Filtering', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 20, def: 10, mag: 20, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: 'Test unit',
  };

  const reviveAbility: Ability = {
    id: 'revive',
    name: 'Revive',
    type: 'healing',
    manaCost: 3,
    basePower: 0,
    targets: 'single-ally',
    unlockLevel: 1,
    description: 'Revives an ally',
    revivesFallen: true,
  };

  it('should allow targeting KOd units with a revival ability', () => {
    const caster = createUnit(mockUnitDef, 1);
    const ally = createUnit({ ...mockUnitDef, id: 'ally' }, 1);
    
    // Kill the ally
    const deadAlly = { ...ally, currentHp: 0 };
    
    const playerTeam = { units: [caster, deadAlly] };
    const enemies: any[] = [];
    
    const validTargets = getValidTargets(reviveAbility, caster, playerTeam, enemies);
    expect(validTargets.map(u => u.id)).toContain(deadAlly.id);

    const targets = resolveTargets(reviveAbility, caster, playerTeam.units, enemies);
    expect(targets.map(u => u.id)).toContain(deadAlly.id);
  });
});
