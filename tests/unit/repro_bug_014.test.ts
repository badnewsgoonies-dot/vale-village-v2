import { describe, it, expect } from 'vitest';
import { createBattleState } from '../../src/core/models/BattleState';
import { createTeam } from '../../src/core/models/Team';
import { createUnit } from '../../src/core/models/Unit';
import { makePRNG } from '../../src/core/random/prng';
import { performAction } from '../../src/core/services/BattleService';
import { BOOST_ATK } from '../../src/data/definitions/abilities';

describe('BUG-014: Missing Status Events', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 50, def: 10, mag: 20, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [BOOST_ATK],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should emit status-applied event for buff abilities', () => {
    const actor = createUnit(mockUnitDef, 1);
    const playerTeam = createTeam([actor]);
    const enemies: any[] = [];
    const rng = makePRNG(123);
    
    const state = createBattleState(playerTeam, enemies);
    
    const result = performAction(state, actor.id, BOOST_ATK.id, [actor.id], rng);
    
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    
    const { events } = result.value;
    const statusEvents = events.filter(e => e.type === 'status-applied');
    
    console.log('Events:', events.map(e => e.type));
    
    // IF THE BUG EXISTS, statusEvents.length will be 0
    // IF THE BUG IS FIXED, statusEvents.length will be 1
    expect(statusEvents.length).toBeGreaterThan(0);
  });
});
