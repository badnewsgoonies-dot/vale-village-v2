import { describe, it, expect } from 'vitest';
import { createUnit, updateUnit } from '@/core/models/Unit';
import { createTeam } from '@/core/models/Team';
import { calculatePsynergyDamage } from '@/core/algorithms/damage';
import type { Equipment } from '@/core/models/Equipment';
import type { Ability } from '@/data/schemas/AbilitySchema';

describe('Accessory elementalResist wiring', () => {
  it('accessory elementalResist reduces psynergy damage', () => {
    // Minimal unit definitions
    const attackerDef = {
      id: 'attacker',
      name: 'Attacker',
      element: 'Jupiter' as const,
      role: 'Elemental Mage' as const,
      baseStats: { hp: 100, pp: 20, atk: 10, def: 5, mag: 30, spd: 8 },
      growthRates: { hp: 10, pp: 1, atk: 1, def: 1, mag: 2, spd: 0 },
      abilities: [],
      manaContribution: 0,
      description: '',
    };

    const defenderDef = {
      id: 'defender',
      name: 'Defender',
      element: 'Venus' as const,
      role: 'Defensive Tank' as const,
      baseStats: { hp: 120, pp: 10, atk: 8, def: 8, mag: 6, spd: 5 },
      growthRates: { hp: 12, pp: 0, atk: 1, def: 1, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 0,
      description: '',
    };

    const attacker = createUnit(attackerDef, 3);
    const defender = createUnit(defenderDef, 3);

    const team = createTeam([attacker, defender]);

    const ability = {
      id: 'test-psy',
      name: 'Test Psy',
      type: 'psynergy',
      element: 'Jupiter' as const,
      manaCost: 1,
      basePower: 30,
      targets: 'single-enemy' as const,
      unlockLevel: 1,
      description: '',
      kind: 'psynergy' as const,
    } as Ability;

    const damageNoAccessory = calculatePsynergyDamage(attacker, defender, team, ability);

    const accessory: Equipment = {
      id: 'resist-charm',
      name: 'Resist Charm',
      slot: 'accessory',
      tier: 'basic',
      cost: 0,
      allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter', 'Neutral'],
      statBonus: {},
      elementalResist: 0.5,
    };

    const defenderWithAccessory = updateUnit(defender, { equipment: { ...defender.equipment, accessory } });
    const teamWithAccessory = createTeam([attacker, defenderWithAccessory]);

    const damageWithAccessory = calculatePsynergyDamage(attacker, defenderWithAccessory, teamWithAccessory, ability);

    expect(damageWithAccessory).toBeLessThan(damageNoAccessory);
  });
});
