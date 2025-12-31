import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { createBattleState } from '../../src/core/models/BattleState';
import { ABILITIES } from '../../src/data/definitions/abilities';
import { makeAIDecision } from '../../src/core/services/AIService';

describe('BUG-005: AI AoE Overkill Restriction', () => {
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

  it('should target all enemies with an AoE ability even with avoidOverkill hint', () => {
    const aoeOverkillAbility: any = {
      ...ABILITIES['quake'],
      id: 'quake-overkill',
      aiHints: {
        avoidOverkill: true,
        priority: 3
      }
    };

    const baseCaster = createUnit(mockUnitDef, 1);
    const caster = { 
      ...baseCaster, 
      abilities: [aoeOverkillAbility],
      unlockedAbilityIds: [aoeOverkillAbility.id]
    };
    
    const enemy1 = createUnit({ ...mockUnitDef, id: 'enemy1' }, 1);
    const enemy2 = createUnit({ ...mockUnitDef, id: 'enemy2' }, 1);
    
    const playerTeam = createTeam([enemy1, enemy2]);
    const enemies = [caster];
    
    const state = createBattleState(playerTeam, enemies);
    const rng = makePRNG(123);
    
    // makeAIDecision for caster (who is an enemy unit)
    const decision = makeAIDecision(state, caster.id, rng);
    
    expect(decision).toBeDefined();
    if (!decision) return;
    
    console.log('AI Decision ability:', decision.abilityId);
    console.log('AI Decision targets:', decision.targetIds);
    
    // IF THE BUG EXISTS, targetIds will have length 1
    // IF THE BUG IS FIXED, targetIds will have length 2 (enemy1 and enemy2)
    expect(decision.targetIds.length).toBeGreaterThan(1);
  });
});
