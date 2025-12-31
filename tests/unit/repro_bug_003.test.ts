import { describe, it, expect } from 'vitest';
import { createBattleState } from '../../src/core/models/BattleState';
import { createTeam } from '../../src/core/models/Team';
import { createUnit } from '../../src/core/models/Unit';
import { executeRound, queueAction } from '../../src/core/services/QueueBattleService';
import { makePRNG } from '../../src/core/random/prng';
import { STRIKE } from '../../src/data/definitions/abilities';

describe('BUG-003: Mana Generation Wipe', () => {
  const mockUnitDef: any = {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus' as const,
    role: 'adept' as const,
    baseStats: { hp: 100, pp: 20, atk: 20, def: 10, mag: 20, spd: 100 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    abilities: [STRIKE],
    manaContribution: 10,
    description: 'Test unit',
  };

  const enemyDef: any = { ...mockUnitDef, id: 'enemy-1', spd: 10 };

  it('should preserve mana generated during execution phase for the next planning phase', () => {
    const actor = createUnit(mockUnitDef, 1);
    const enemy = createUnit(enemyDef, 1);
    const playerTeam = createTeam([actor]);
    const enemies = [enemy];
    const rng = makePRNG(123);

    let state = createBattleState(playerTeam, enemies);
    state = { ...state, remainingMana: 0 }; 
    expect(state.remainingMana).toBe(0);

    const queueResult = queueAction(state, actor.id, null, [enemy.id]);
    expect(queueResult.ok).toBe(true);
    if (!queueResult.ok) return;
    state = queueResult.value;
    console.log('Queued actions:', state.queuedActions.length);

    const roundResult = executeRound(state, rng);
    const events = roundResult.events;
    const manaEvents = events.filter(e => e.type === 'mana-generated');
    const finalState = roundResult.state;

    console.log('Events:', events.map(e => e.type));
    console.log('Mana events:', manaEvents);
    console.log('Final remainingMana:', finalState.remainingMana);

    expect(finalState.roundNumber).toBe(2);
    expect(finalState.phase).toBe('planning');
    expect(manaEvents.length).toBeGreaterThan(0);
    expect(finalState.remainingMana).toBe(1);
  });
});
