/**
 * Unit tests for Battle State Invariants
 * Tests all error paths for battle state validation
 */

import { describe, it, expect } from 'vitest';
import {
  validateBattleState,
  BattleStateInvariantError,
} from '../../../src/core/validation/battleStateInvariants';
import type { BattleState } from '../../../src/core/models/BattleState';
import type { Unit } from '../../../src/core/models/Unit';
import type { Team } from '../../../src/core/models/Team';

// Helper to create minimal unit
function createTestUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'test-unit',
    name: 'Test Unit',
    element: 'Venus',
    role: 'Adept',
    level: 1,
    xp: 0,
    currentHp: 50,
    baseStats: { hp: 50, pp: 20, atk: 10, def: 8, mag: 5, spd: 7 },
    growthRates: { hp: 5, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
    manaContribution: 1,
    description: 'Test unit',
    equipment: { weapon: null, armor: null, accessory: null },
    djinn: [],
    djinnStates: {},
    abilities: [],
    unlockedAbilityIds: [],
    storeUnlocked: false,
    statusEffects: [],
    actionsTaken: 0,
    battleStats: { damageDealt: 0, damageTaken: 0, healingDone: 0, abilitiesUsed: 0, criticalHits: 0 },
    ...overrides,
  };
}

// Helper to create valid battle state for testing
function createValidBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
  const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

  const unitById = new Map();
  unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
  unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

  return {
    id: 'test-battle',
    encounterId: 'house-01',
    phase: 'planning',
    status: 'IN_PROGRESS',
    roundNumber: 1,
    playerTeam: {
      units: [playerUnit],
      djinnTrackers: {},
    },
    enemies: [enemyUnit],
    queuedActions: [null], // One slot per unit
    queuedDjinn: [],
    djinnRecoveryTimers: {},
    remainingMana: 3,
    maxMana: 5,
    unitById,
    eventLog: [],
    battleStartTimestamp: Date.now(),
    manaPool: { current: 3, max: 5, circles: [] },
    rng: { seed: 12345 },
    ...overrides,
  } as BattleState;
}

describe('BattleStateInvariants', () => {
  describe('Mana Invariants', () => {
    it('should throw MANA_EXCEEDS_MAX when remaining mana > max mana', () => {
      const state = createValidBattleState({
        remainingMana: 10,
        maxMana: 5,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect(e).toBeInstanceOf(BattleStateInvariantError);
        expect((e as BattleStateInvariantError).invariant).toBe('MANA_EXCEEDS_MAX');
      }
    });

    it('should throw MANA_NEGATIVE when remaining mana < 0', () => {
      const state = createValidBattleState({
        remainingMana: -5,
        maxMana: 5,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('MANA_NEGATIVE');
      }
    });

    it('should throw MANA_EXCEEDS_MAX when max mana < 0 (fires first due to check order)', () => {
      // Note: MAX_MANA_NEGATIVE is unreachable due to check order.
      // When maxMana < 0 and remainingMana >= 0, MANA_EXCEEDS_MAX triggers first.
      // When maxMana < 0 and remainingMana < 0, MANA_NEGATIVE triggers first.
      // This test verifies the actual behavior when maxMana is negative.
      const state = createValidBattleState({
        remainingMana: 0,
        maxMana: -1,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        // MANA_EXCEEDS_MAX fires because 0 > -1
        expect((e as BattleStateInvariantError).invariant).toBe('MANA_EXCEEDS_MAX');
      }
    });

    it('should pass when mana values are valid', () => {
      const state = createValidBattleState({
        remainingMana: 3,
        maxMana: 5,
      });

      expect(() => validateBattleState(state)).not.toThrow();
    });
  });

  describe('HP Invariants', () => {
    it('should throw HP_NEGATIVE when unit has negative HP', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: -10 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('HP_NEGATIVE');
      }
    });

    it('should throw HP_EXCEEDS_MAX when unit HP exceeds calculated max', () => {
      // Level 1 with baseStats.hp=50 and growthRates.hp=5 should have maxHp=50
      const playerUnit = createTestUnit({
        id: 'player-1',
        level: 1,
        currentHp: 100, // Far exceeds max of 50
        baseStats: { hp: 50, pp: 20, atk: 10, def: 8, mag: 5, spd: 7 },
        growthRates: { hp: 5, pp: 2, atk: 2, def: 1, mag: 1, spd: 1 },
      });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('HP_EXCEEDS_MAX');
      }
    });

    it('should allow HP at 0 (KO state)', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 0 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      // Should not throw - 0 HP is valid (KO state)
      expect(() => validateBattleState(state)).not.toThrow();
    });
  });

  describe('Queue Invariants', () => {
    it('should throw QUEUE_LENGTH_INVALID when queue size != team size', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [null, null, null], // 3 slots but only 1 unit
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_LENGTH_INVALID');
      }
    });

    it('should throw QUEUE_INVALID_UNIT when action references non-existent unit', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [{
          unitId: 'non-existent-unit',
          abilityId: 'attack',
          targetIds: ['enemy-1'],
          manaCost: 0,
        }],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_INVALID_UNIT');
      }
    });

    it('should throw QUEUE_NEGATIVE_COST when action has negative mana cost', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [{
          unitId: 'player-1',
          abilityId: 'attack',
          targetIds: ['enemy-1'],
          manaCost: -5, // Invalid negative cost
        }],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_NEGATIVE_COST');
      }
    });

    it('should throw QUEUE_INVALID_TARGET when action targets non-existent unit', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [{
          unitId: 'player-1',
          abilityId: 'attack',
          targetIds: ['ghost-unit'], // Non-existent target
          manaCost: 0,
        }],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_INVALID_TARGET');
      }
    });

    it('should throw QUEUE_INVALID_DJINN when queued Djinn not in trackers', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {}, // No trackers
        },
        enemies: [enemyUnit],
        queuedDjinn: ['unknown-djinn'], // Queued but no tracker
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_INVALID_DJINN');
      }
    });

    it('should throw QUEUE_DJINN_NOT_SET when queued Djinn is not in Set state', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {
            'flint': { djinnId: 'flint', state: 'Standby', lastActivatedTurn: 1 },
          },
        },
        enemies: [enemyUnit],
        queuedDjinn: ['flint'], // Djinn is Standby, not Set
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('QUEUE_DJINN_NOT_SET');
      }
    });
  });

  describe('Phase Invariants', () => {
    it('should throw PHASE_INVALID for unknown phase', () => {
      const state = createValidBattleState({
        phase: 'unknown-phase' as any,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_INVALID');
      }
    });

    it('should throw PHASE_PLANNING_INVALID_ROUND when planning with round < 1', () => {
      const state = createValidBattleState({
        phase: 'planning',
        roundNumber: 0,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_PLANNING_INVALID_ROUND');
      }
    });

    it('should throw PHASE_EXECUTING_INCOMPLETE_QUEUE when executing with null actions for alive units', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'executing',
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [null], // Incomplete queue for alive unit
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_EXECUTING_INCOMPLETE_QUEUE');
      }
    });

    it('should allow null actions for KO\'d units in executing phase', () => {
      const alivePlayer = createTestUnit({ id: 'player-1', currentHp: 50 });
      const koPlayer = createTestUnit({ id: 'player-2', currentHp: 0 }); // KO'd
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: alivePlayer, isPlayer: true, index: 0 });
      unitById.set('player-2', { unit: koPlayer, isPlayer: true, index: 1 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'executing',
        playerTeam: { units: [alivePlayer, koPlayer], djinnTrackers: {} },
        enemies: [enemyUnit],
        queuedActions: [
          { unitId: 'player-1', abilityId: 'attack', targetIds: ['enemy-1'], manaCost: 0 },
          null, // KO'd unit has null action - this should be allowed
        ],
        unitById,
      });

      // Should NOT throw - KO'd units are allowed to have null actions
      expect(() => validateBattleState(state)).not.toThrow();
    });

    it('should throw PHASE_VICTORY_ENEMIES_ALIVE when victory but enemies have HP', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 }); // Still alive

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'victory',
        status: 'PLAYER_VICTORY',
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_VICTORY_ENEMIES_ALIVE');
      }
    });

    it('should throw PHASE_DEFEAT_PLAYERS_ALIVE when defeat but players have HP', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 }); // Still alive
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'defeat',
        status: 'PLAYER_DEFEAT',
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_DEFEAT_PLAYERS_ALIVE');
      }
    });

    it('should throw PHASE_STATUS_MISMATCH when victory phase but wrong status', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 0 }); // KO

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'victory',
        status: 'IN_PROGRESS', // Wrong status for victory
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('PHASE_STATUS_MISMATCH');
      }
    });
  });

  describe('Djinn Invariants', () => {
    it('should throw DJINN_INVALID_STATE for unknown Djinn state', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {
            'flint': { djinnId: 'flint', state: 'Invalid' as any, lastActivatedTurn: 1 },
          },
        },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('DJINN_INVALID_STATE');
      }
    });

    it('should throw DJINN_NEGATIVE_TIMER for negative recovery timer', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {
            'flint': { djinnId: 'flint', state: 'Standby', lastActivatedTurn: 1 },
          },
        },
        enemies: [enemyUnit],
        djinnRecoveryTimers: { 'flint': -5 },
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('DJINN_NEGATIVE_TIMER');
      }
    });

    it('should throw DJINN_TIMER_NO_TRACKER for timer with no tracker', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {}, // No tracker for flint
        },
        enemies: [enemyUnit],
        djinnRecoveryTimers: { 'flint': 2 }, // Has timer but no tracker
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('DJINN_TIMER_NO_TRACKER');
      }
    });

    it('should throw DJINN_TIMER_STATE_MISMATCH for timer > 0 but not Standby', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: {
          units: [playerUnit],
          djinnTrackers: {
            'flint': { djinnId: 'flint', state: 'Set', lastActivatedTurn: 1 }, // Set, not Standby
          },
        },
        enemies: [enemyUnit],
        djinnRecoveryTimers: { 'flint': 2 }, // Has timer but wrong state
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('DJINN_TIMER_STATE_MISMATCH');
      }
    });
  });

  describe('Unit Index Invariants', () => {
    it('should throw INDEX_MISSING_PLAYER when player not in index', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      // Only add enemy, not player
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('INDEX_MISSING_PLAYER');
      }
    });

    it('should throw INDEX_WRONG_SIDE_PLAYER when player marked as enemy', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: false, index: 0 }); // Wrong side
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('INDEX_WRONG_SIDE_PLAYER');
      }
    });

    it('should throw INDEX_MISSING_ENEMY when enemy not in index', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      // Only add player, not enemy
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('INDEX_MISSING_ENEMY');
      }
    });

    it('should throw INDEX_WRONG_SIDE_ENEMY when enemy marked as player', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: true, index: 0 }); // Wrong side

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('INDEX_WRONG_SIDE_ENEMY');
      }
    });

    it('should throw INDEX_SIZE_MISMATCH when index has extra entries', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });
      unitById.set('ghost-unit', { unit: createTestUnit(), isPlayer: true, index: 2 }); // Extra

      const state = createValidBattleState({
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).toThrow(BattleStateInvariantError);
      try {
        validateBattleState(state);
      } catch (e) {
        expect((e as BattleStateInvariantError).invariant).toBe('INDEX_SIZE_MISMATCH');
      }
    });
  });

  describe('BattleStateInvariantError', () => {
    it('should include invariant name in message', () => {
      const error = new BattleStateInvariantError(
        'Test message',
        'TEST_INVARIANT',
        { key: 'value' }
      );

      expect(error.message).toContain('TEST_INVARIANT');
      expect(error.message).toContain('Test message');
      expect(error.invariant).toBe('TEST_INVARIANT');
      expect(error.context).toEqual({ key: 'value' });
    });
  });

  describe('Valid States', () => {
    it('should pass for completely valid state', () => {
      const state = createValidBattleState();
      expect(() => validateBattleState(state)).not.toThrow();
    });

    it('should pass for valid victory state', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 50 });
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 0 }); // KO

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'victory',
        status: 'PLAYER_VICTORY',
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).not.toThrow();
    });

    it('should pass for valid defeat state', () => {
      const playerUnit = createTestUnit({ id: 'player-1', currentHp: 0 }); // KO
      const enemyUnit = createTestUnit({ id: 'enemy-1', currentHp: 30 });

      const unitById = new Map();
      unitById.set('player-1', { unit: playerUnit, isPlayer: true, index: 0 });
      unitById.set('enemy-1', { unit: enemyUnit, isPlayer: false, index: 0 });

      const state = createValidBattleState({
        phase: 'defeat',
        status: 'PLAYER_DEFEAT',
        playerTeam: { units: [playerUnit], djinnTrackers: {} },
        enemies: [enemyUnit],
        unitById,
      });

      expect(() => validateBattleState(state)).not.toThrow();
    });
  });
});
