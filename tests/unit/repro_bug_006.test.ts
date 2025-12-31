import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { createBattleState } from '../../src/core/models/BattleState';
import { makeAIDecision } from '../../src/core/services/AIService';
import { STRIKE } from '../../src/data/definitions/abilities';

describe('BUG-006: AI Ignores Debuffs', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'adept',
    baseStats: { hp: 100, pp: 20, atk: 50, def: 10, mag: 20, spd: 100 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should give a non-zero score to debuff abilities', () => {
    const debuffAbility: any = {
      id: 'weaken',
      name: 'Weaken',
      type: 'debuff',
      manaCost: 1,
      basePower: 0,
      targets: 'single-enemy',
      unlockLevel: 1,
      description: 'Reduces enemy ATK',
      debuffEffect: {
        atk: 30
      },
      aiHints: {
        priority: 1
      }
    };

    const baseCaster = createUnit(mockUnitDef, 1);
    const caster = { 
      ...baseCaster, 
      abilities: [STRIKE, debuffAbility],
      unlockedAbilityIds: [STRIKE.id, debuffAbility.id]
    };
    
    const enemy = createUnit({ ...mockUnitDef, id: 'enemy' }, 1);
    const playerTeam = createTeam([enemy]);
    const enemies = [caster];
    
    const state = createBattleState(playerTeam, enemies);
    const rng = makePRNG(123);
    
    const decision = makeAIDecision(state, caster.id, rng);
    
    expect(decision).toBeDefined();
    if (!decision) return;
    
    console.log('AI Decision ability:', decision.abilityId);
    
    // IF THE BUG EXISTS, AI will pick STRIKE because weaken utility is 0
    // STRIKE score: 10 (priority) + 4 (utility) = 14
    // Weaken score: 10 (priority) + 0 (utility) = 10
    // Expected: strike
    
    expect(decision.abilityId).toBe('weaken');
  });
});
