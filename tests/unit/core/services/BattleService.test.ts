import { describe, it, expect } from 'vitest';
import { performAction, startBattle } from '../../../../src/core/services/BattleService';
import { createUnit } from '../../../../src/core/models/Unit';
import { createTeam } from '../../../../src/core/models/Team';
import { makePRNG } from '../../../../src/core/random/prng';
import type { UnitDefinition } from '../../../../src/core/models/Unit';
import type { Ability } from '../../../../src/data/schemas/AbilitySchema';

describe('BattleService', () => {
  const mockAbility: Ability = {
    id: 'test-aoe',
    name: 'Test AOE',
    type: 'psynergy',
    element: 'Venus',
    power: 10,
    cost: 5,
    targets: 'all-enemies',
    description: 'Test AOE ability',
  };

  const mockUnitDef: UnitDefinition = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: {
      hp: 100,
      pp: 20,
      atk: 20,
      def: 10,
      mag: 20,
      spd: 10,
    },
    growthRates: {
      hp: 0,
      pp: 0,
      atk: 0,
      def: 0,
      mag: 0,
      spd: 0,
    },
    abilities: [mockAbility],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should track per-target damage in AOE actions', () => {
    const actor = createUnit(mockUnitDef, 1);
    const enemy1 = createUnit({ ...mockUnitDef, id: 'enemy1' }, 1);
    const enemy2 = createUnit({ ...mockUnitDef, id: 'enemy2' }, 1);
    
    const playerTeam = createTeam([actor]);
    const enemies = [enemy1, enemy2];
    const rng = makePRNG(123);
    
    const battleStateResult = startBattle(playerTeam, enemies, rng);
    expect(battleStateResult.ok).toBe(true);
    if (!battleStateResult.ok) return;
    
    const state = battleStateResult.value;
    
    const actionResult = performAction(
      state,
      actor.id,
      mockAbility.id,
      [enemy1.id, enemy2.id],
      rng
    );
    
    expect(actionResult.ok).toBe(true);
    if (!actionResult.ok) return;
    
    const { result, events } = actionResult.value;
    
    // Total damage should be the sum of individual damages
    const hitEvents = events.filter(e => e.type === 'hit');
    expect(hitEvents.length).toBe(2);
    
    const totalDamage = (result.damage || 0);
    const damage1 = (hitEvents[0] as any).amount;
    const damage2 = (hitEvents[1] as any).amount;
    
    expect(damage1 + damage2).toBe(totalDamage);
    expect(damage1).toBeLessThan(totalDamage);
    expect(damage2).toBeLessThan(totalDamage);
    
    // Verify targetResults is present and correct
    expect(result.targetResults).toBeDefined();
    expect(result.targetResults?.[enemy1.id]?.damage).toBe(damage1);
    expect(result.targetResults?.[enemy2.id]?.damage).toBe(damage2);
  });
});
