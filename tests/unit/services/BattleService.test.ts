import { describe, it, expect } from 'vitest';
import { makePRNG } from '../../../src/core/random/prng';
import { createTeam } from '../../../src/core/models/Team';
import { createBattleState } from '../../../src/core/models/BattleState';
import { startTurnTick } from '../../../src/core/services/BattleService';
import type { Unit } from '../../../src/core/models/Unit';

function createTestUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'unit-1',
    name: 'Unit',
    element: 'Venus',
    role: 'Balanced Warrior',
    level: 1,
    xp: 0,
    currentHp: 100,
    baseStats: { hp: 100, pp: 0, atk: 10, def: 10, mag: 10, spd: 10 },
    growthRates: { hp: 0, pp: 0, atk: 0, def: 0, mag: 0, spd: 0 },
    manaContribution: 0,
    description: 'test',
    equipment: { weapon: null, armor: null, helm: null, boots: null, accessory: null },
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    storeUnlocked: false,
    statusEffects: [],
    actionsTaken: 0,
    battleStats: { damageDealt: 0, damageTaken: 0 },
    ...overrides,
  };
}

describe('BattleService', () => {
  describe('startTurnTick', () => {
    it('does not emit status-expired when a duration-based status remains active', () => {
      const unit = createTestUnit({
        id: 'player-1',
        statusEffects: [{ type: 'poison', damagePerTurn: 1, duration: 2 }],
      });
      const enemy = createTestUnit({ id: 'enemy-1' });

      const team = createTeam([unit]);
      const state = createBattleState(team, [enemy], [unit.id]);

      const result = startTurnTick(state, makePRNG(123));
      const expired = result.events.filter((e) => e.type === 'status-expired');

      expect(expired).toHaveLength(0);
    });

    it('emits status-expired when a duration-based status expires', () => {
      const unit = createTestUnit({
        id: 'player-1',
        statusEffects: [{ type: 'poison', damagePerTurn: 1, duration: 1 }],
      });
      const enemy = createTestUnit({ id: 'enemy-1' });

      const team = createTeam([unit]);
      const state = createBattleState(team, [enemy], [unit.id]);

      const result = startTurnTick(state, makePRNG(123));
      const expired = result.events.filter((e) => e.type === 'status-expired');

      expect(expired).toHaveLength(1);
      expect(expired[0]?.status.type).toBe('poison');
    });
  });
});
