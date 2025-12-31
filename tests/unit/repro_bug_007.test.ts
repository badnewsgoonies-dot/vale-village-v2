import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { makePRNG } from '../../src/core/random/prng';
import { executeRound, queueDjinn } from '../../src/core/services/QueueBattleService';
import { createBattleState } from '../../src/core/models/BattleState';
import { DJINN } from '../../src/data/definitions/djinn';

describe('BUG-007: Summon Healing Revive', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Mercury',
    role: 'healer',
    baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 20, spd: 100 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [],
    manaContribution: 1,
    description: 'Test unit',
  };

  it('should NOT revive KOd units with a healing summon', async () => {
    const caster = createUnit(mockUnitDef, 1);
    const deadAlly = { ...createUnit({ ...mockUnitDef, id: 'dead-ally' }, 1), currentHp: 0 };
    
    // Find a healing mercury djinn
    const mercuryDjinnId = Object.keys(DJINN).find(id => DJINN[id].element === 'Mercury' && DJINN[id].summonEffect.type === 'heal');
    if (!mercuryDjinnId) {
      console.warn('No healing mercury djinn found, skipping test');
      return;
    }

    let playerTeam = createTeam([caster, deadAlly]);
    // Set djinn to 'Set' state so it can be queued
    playerTeam.djinnTrackers[mercuryDjinnId] = {
      djinnId: mercuryDjinnId,
      state: 'Set',
    };
    playerTeam.equippedDjinn = [mercuryDjinnId];

    const enemies = [createUnit({ ...mockUnitDef, id: 'enemy' }, 1)];
    const rng = makePRNG(123);
    
    let state = createBattleState(playerTeam, enemies);
    
    // Queue the djinn
    const queueResult = queueDjinn(state, mercuryDjinnId);
    expect(queueResult.ok).toBe(true);
    if (!queueResult.ok) return;
    state = queueResult.value;

    // Queue a basic attack for caster to satisfy validation
    const { queueAction } = await import('../../src/core/services/QueueBattleService');
    const qaResult = queueAction(state, caster.id, null, [enemies[0].id]);
    state = qaResult.value;

    const roundResult = executeRound(state, rng);
    const finalState = roundResult.state;
    const finalDeadAlly = finalState.playerTeam.units.find(u => u.id === deadAlly.id);

    console.log('Dead ally HP after healing summon:', finalDeadAlly?.currentHp);
    
    // IF THE BUG EXISTS, finalDeadAlly.currentHp > 0
    // IF THE BUG IS FIXED, finalDeadAlly.currentHp === 0
    expect(finalDeadAlly?.currentHp).toBe(0);
  });
});
