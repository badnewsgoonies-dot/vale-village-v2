import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { calculateTurnOrder } from '../../src/core/algorithms/turn-order';

describe('BUG-010: Unstable Turn Order Tie-break', () => {
  const mockUnitDef: any = {
    id: 'unit',
    name: 'Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 20, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should maintain relative turn order of B and C when A dies', () => {
    // We need units with SAME speed to trigger tie-breaker
    const unitA = createUnit({ ...mockUnitDef, id: 'A', spd: 10 }, 1);
    const unitB = createUnit({ ...mockUnitDef, id: 'B', spd: 10 }, 1);
    const unitC = createUnit({ ...mockUnitDef, id: 'C', spd: 10 }, 1);
    
    const team = createTeam([unitA, unitB, unitC]);
    const units = [unitA, unitB, unitC];
    
    // We'll try many seeds until we find one where B and C would flip if A was removed
    let flipFound = false;
    for (let seed = 1; seed < 100; seed++) {
      const rng = makePRNG(seed);
      
      const order1 = calculateTurnOrder(units, team, rng.clone(), 1);
      
      const deadA = { ...unitA, currentHp: 0 };
      const unitsWithDeadA = [deadA, unitB, unitC];
      const order2 = calculateTurnOrder(unitsWithDeadA, team, rng.clone(), 1);
      
      const indexB1 = order1.indexOf('B');
      const indexC1 = order1.indexOf('C');
      const bBeforeC1 = indexB1 < indexC1;
      
      const indexB2 = order2.indexOf('B');
      const indexC2 = order2.indexOf('C');
      const bBeforeC2 = indexB2 < indexC2;
      
      if (bBeforeC1 !== bBeforeC2) {
        console.log(`FLIP FOUND at seed ${seed}!`);
        console.log('Order 1:', order1);
        console.log('Order 2:', order2);
        flipFound = true;
        expect(bBeforeC1).toBe(bBeforeC2);
        break;
      }
    }
    
    if (!flipFound) {
      console.warn('Could not find a flipping seed in 100 tries');
    }
  });
});
