import { describe, it, expect } from 'vitest';
import create from 'zustand';
import { createQueueBattleSlice } from '../../src/ui/state/queueBattleSlice';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { createBattleState } from '../../src/core/models/BattleState';

describe('QueueBattleSlice setBattle', () => {
  it('clears queuedActions when starting a fresh battle (round 1, turn 0)', () => {
    const useStore = create(createQueueBattleSlice as any);

    const unitDef = {
      id: 'u1',
      name: 'Test',
      element: 'Neutral',
      role: 'Balanced Warrior',
      baseStats: { hp: 10, pp: 5, atk: 2, def: 1, mag: 1, spd: 3 },
      growthRates: { hp: 1, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
      abilities: [],
      manaContribution: 1,
      description: '',
    } as any;

    const u1 = createUnit(unitDef, 1);
    const u2 = createUnit({ ...unitDef, id: 'u2', name: 'T2' } as any, 1);

    const team = createTeam([u1, u2]);
    const battle = createBattleState(team, []);

    // Simulate leftover queued actions from a previous battle
    const filledQueue = [
      { unitId: u1.id, abilityId: null, targetIds: [], manaCost: 0 },
      { unitId: u2.id, abilityId: null, targetIds: [], manaCost: 0 },
    ];

    const previousBattle = { ...battle, queuedActions: filledQueue } as any;

    // Start a new battle (round 1, turn 0) using setBattle
    useStore.getState().setBattle(previousBattle, 42);

    const resulting = useStore.getState().battle;
    expect(resulting).not.toBeNull();
    expect(resulting?.queuedActions.every((a: any) => a === null)).toBe(true);
  });
});
