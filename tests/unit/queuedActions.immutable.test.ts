import { describe, it, expect } from 'vitest';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { createBattleState } from '../../src/core/models/BattleState';
import { queueAction } from '../../src/core/services/QueueBattleService';

// Minimal unit definition matching UnitDefinition shape used by createUnit
const baseDef = (id: string) => ({
  id,
  name: id,
  element: 'neutral' as const,
  role: 'attacker' as const,
  baseStats: { hp: 10, atk: 1, def: 1, matk: 0, mdef: 0, spd: 5 },
  growthRates: { hp: 1, atk: 0, def: 0, matk: 0, mdef: 0, spd: 0 },
  abilities: [],
  manaContribution: 1,
  description: '',
});

describe('queuedActions immutability', () => {
  it('does not mutate the original queuedActions array when queueing an action', () => {
    const playerUnit = createUnit(baseDef('player1'));
    const enemyUnit = createUnit(baseDef('enemy1'));

    const team = createTeam([playerUnit]);
    const battle = createBattleState(team, [enemyUnit]);

    const originalQueueRef = battle.queuedActions;

    // Sanity: initial queue slot is null
    expect(originalQueueRef[0]).toBeNull();

    const res = queueAction(battle, playerUnit.id, null, [enemyUnit.id]);
    expect(res.ok).toBe(true);

    const newState = res.value;

    // New state has an action queued
    expect(newState.queuedActions[0]).not.toBeNull();

    // Original queue reference must remain unchanged (no in-place mutation)
    expect(originalQueueRef[0]).toBeNull();

    // And the arrays should not be the same reference
    expect(originalQueueRef).not.toBe(newState.queuedActions);
  });
});
