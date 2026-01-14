
import { describe, it, expect } from 'vitest';
import {
  executeRound,
  queueAction,
  refreshMana,
} from './QueueBattleService';
import { createUnit } from '../models/Unit';
import { createTeam } from '../models/Team';
import { createBattleState, updateBattleState } from '../models/BattleState';
import type { BattleState } from '../models/BattleState';
import { UNIT_DEFINITIONS } from '../../data/definitions/units';
import { makePRNG } from '../random/prng';
import type { Ability } from '../../data/schemas/AbilitySchema';

const MOCK_ABILITY: Ability = {
  id: 'mock-fireball',
  name: 'Fireball',
  type: 'psynergy',
  element: 'Mars',
  manaCost: 1, 
  basePower: 30,
  targets: 'single-enemy',
  unlockLevel: 1,
  description: 'Test ability',
  aiHints: { priority: 1, target: 'weakest', avoidOverkill: false },
};

function createTestBattleState(
  playerUnits = [UNIT_DEFINITIONS['adept']!],
  enemyUnits = [UNIT_DEFINITIONS['adept']!]
): BattleState {
  const pUnits = playerUnits.map((def, i) => ({
    ...createUnit(def, 1, 0),
    id: `player-${i}`
  }));
  
  const eUnits = enemyUnits.map((def, i) => ({
    ...createUnit(def, 1, 0),
    id: `enemy-${i}`,
    // Set DEF to 0 to ensure damage
    baseStats: { ...def.baseStats, def: 0 }
  }));

  const playerTeam = createTeam(pUnits);
  return createBattleState(playerTeam, eUnits, []);
}

describe('QueueBattleService', () => {
  describe('queueAction', () => {
    it('should queue an action and reduce mana', () => {
      const state = createTestBattleState();
      const unitId = state.playerTeam.units[0]!.id;
      
      const result = queueAction(state, unitId, 'mock-fireball', ['enemy-0'], MOCK_ABILITY);
      
      if (!result.ok) {
        throw new Error(`queueAction failed: ${result.error}`);
      }
      
      expect(result.ok).toBe(true);
      expect(result.value.queuedActions[0]).toEqual({
        unitId,
        abilityId: 'mock-fireball',
        targetIds: ['enemy-0'],
        manaCost: 1,
      });
      expect(result.value.remainingMana).toBe(state.maxMana - 1);
    });

    it('should fail if not enough mana', () => {
      const state = createTestBattleState();
      const unitId = state.playerTeam.units[0]!.id;
      
      const lowManaState = updateBattleState(state, { remainingMana: 0 });
      
      const result = queueAction(lowManaState, unitId, 'mock-fireball', ['enemy-0'], MOCK_ABILITY);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Cannot afford action');
      }
    });
  });

  describe('refreshMana', () => {
    it('should restore mana to max', () => {
      const state = createTestBattleState();
      const usedManaState = updateBattleState(state, { remainingMana: 0 });
      
      const refreshedState = refreshMana(usedManaState);
      expect(refreshedState.remainingMana).toBe(refreshedState.maxMana);
    });
  });

  describe('executeRound', () => {
    it('should execute queued actions and apply damage', () => {
      const state = createTestBattleState();
      const playerUnit = state.playerTeam.units[0];
      const enemyUnit = state.enemies[0];
      const rng = makePRNG(Date.now());

      const queueResult = queueAction(state, playerUnit!.id, null, [enemyUnit!.id]);
      if (!queueResult.ok) throw new Error(queueResult.error);
      
      let battleState = queueResult.value;

      const { state: newState, events } = executeRound(battleState, rng);

      // Check for hit events
      const damageEvents = events.filter(e => e.type === 'hit' && e.targetId === enemyUnit!.id);
      expect(damageEvents.length).toBeGreaterThan(0);
      
      // Check battle stats to confirm processing
      const updatedEnemy = newState.enemies.find(e => e.id === enemyUnit!.id);
      if (!updatedEnemy) throw new Error('Enemy disappeared from state');
      
      // We check damageTaken instead of currentHp because HP might be reset by other logic
      expect(updatedEnemy.battleStats.damageTaken).toBeGreaterThan(0);
    });

    it('should prioritize faster units', () => {
      const rangerDef = UNIT_DEFINITIONS['ranger']!;
      const adeptDef = UNIT_DEFINITIONS['adept']!;
      const fastDef = { ...rangerDef, baseStats: { ...rangerDef.baseStats, spd: 500 } };
      const slowDef = { ...adeptDef, baseStats: { ...adeptDef.baseStats, spd: 10 } };
      
      const p1 = { ...createUnit(fastDef, 1, 0), id: 'fast-player' };
      const p2 = { ...createUnit(slowDef, 1, 0), id: 'slow-player' };
      const playerTeam = createTeam([p1, p2]);
      
      const enemy = { ...createUnit(slowDef, 1, 0), id: 'enemy-0' };
      const toughEnemy = { ...enemy, currentHp: 500, maxHp: 500, baseStats: { ...enemy.baseStats, hp: 500 } };

      let state = createBattleState(playerTeam, [toughEnemy], []); 
      const rng = makePRNG(12345);

      let qResult = queueAction(state, 'fast-player', null, ['enemy-0']);
      if (!qResult.ok) throw new Error(`Fast player queue failed: ${qResult.error}`);
      state = qResult.value;

      qResult = queueAction(state, 'slow-player', null, ['enemy-0']);
      if (!qResult.ok) throw new Error(`Slow player queue failed: ${qResult.error}`);
      state = qResult.value;

      const { events } = executeRound(state, rng);

      const manaEvents = events.filter(e => e.type === 'mana-generated');
      expect(manaEvents.length).toBeGreaterThanOrEqual(2);
      if (manaEvents.length >= 2) {
        const event0 = manaEvents[0];
        const event1 = manaEvents[1];
        expect(event0?.source).toBe('fast-player');
        expect(event1?.source).toBe('slow-player');
      }
    });

    it('should handle KOd targets gracefully (retargeting)', () => {
      const state = createTestBattleState();
      const playerUnit = state.playerTeam.units[0];
      const enemy1 = state.enemies[0];
      const adeptDef = UNIT_DEFINITIONS['adept']!;
      const enemy2 = { ...createUnit(adeptDef, 1, 0), id: 'enemy-1' };
      
      const weakEnemy1 = { ...enemy1!, currentHp: 1 };
      const weakEnemy2 = { ...enemy2, currentHp: 50 };
      
      const multiEnemyState = updateBattleState(state, { 
        enemies: [weakEnemy1, weakEnemy2] 
      });

      const rng = makePRNG(12345);

      const queueResult = queueAction(multiEnemyState, playerUnit!.id, null, ['enemy-0']);
      if (!queueResult.ok) throw new Error(queueResult.error);
      let battleState = queueResult.value;

      const koEnemy1 = { ...weakEnemy1, currentHp: 0 };
      battleState = updateBattleState(battleState, {
        enemies: [koEnemy1, weakEnemy2]
      });

      const { events } = executeRound(battleState, rng);

      const hitEvent = events.find(e => e.type === 'hit');
      
      expect(hitEvent).toBeDefined();
      expect(hitEvent?.targetId).toBe('enemy-1');
    });
  });
});
