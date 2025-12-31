import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { performAction } from '../../src/core/services/BattleService';
import { createBattleState } from '../../src/core/models/BattleState';
import { QUAKE } from '../../src/data/definitions/abilities';

describe('BUG-002: AoE Damage Reporting', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 50, def: 10, mag: 20, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [QUAKE],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should report individual damage for each target in AoE Psynergy', () => {
    const caster = createUnit(mockUnitDef, 1);
    const enemy1 = createUnit({ ...mockUnitDef, id: 'enemy1' }, 1);
    const enemy2 = createUnit({ ...mockUnitDef, id: 'enemy2' }, 1);
    
    const playerTeam = createTeam([caster]);
    const enemies = [enemy1, enemy2];
    const rng = makePRNG(123);
    
    const state = createBattleState(playerTeam, enemies);
    
    const result = performAction(state, caster.id, QUAKE.id, [enemy1.id, enemy2.id], rng);
    
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    
    const { events } = result.value;
    const hitEvents = events.filter(e => e.type === 'hit');
    
    expect(hitEvents.length).toBe(2);
    
    const totalDamage = result.value.result.damage || 0;
    const damage1 = (hitEvents[0] as any).amount;
    const damage2 = (hitEvents[1] as any).amount;
    
    console.log('Total damage:', totalDamage);
    console.log('Damage 1:', damage1);
    console.log('Damage 2:', damage2);
    
    // IF THE BUG EXISTS, damage1 === totalDamage AND damage2 === totalDamage
    // IF THE BUG IS FIXED, damage1 + damage2 === totalDamage (approximately)
    expect(damage1).toBeLessThan(totalDamage);
    expect(damage2).toBeLessThan(totalDamage);
  });
});
